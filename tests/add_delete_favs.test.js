const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');
const Usuario = require('../api/src/models/Usuario');

describe('Favorites API tests', () => {
    let mongoServer;
    let agent;
    let userId;
    let productId;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const usuario = new Usuario({
            Nombre: 'Test',
            Apellidos: 'User',
            Direccion: '123 Calle Principal',
            Correo: 'test_user@example.com',
            Password: 'password',
            Rol: 'user',
            Productos_vendidos: [],
            Productos_comprados: [],
            Favoritos: []
        });
        const savedUsuario = await usuario.save();
        userId = savedUsuario._id;

        const producto = new Producto({
            Nombre: 'Test Producto',
            Descripcion: 'Descripción de prueba',
            Precio: 10,
            Categoria: 'Prueba',
            Imagen: 'imagen.jpg',
        });
        const savedProducto = await producto.save();
        productId = savedProducto._id;

        agent = request.agent(app);
        const loginResponse = await agent.post('/api/usuario/auth/login').send({
            correo: 'test_user@example.com',
            contraseña: 'password',
        });

        if (loginResponse.status !== 200) {
            throw new Error(`Error al iniciar sesión: ${loginResponse.status}`);
        }
    });

    afterAll(async () => {
        await Producto.deleteMany({Nombre: 'Test Producto'});
        await Usuario.deleteMany({Correo:'test_user@example.com'});
        await mongoose.disconnect();
        await mongoServer.stop();
    });


    describe('POST /api/producto/favourites', () => {
        it('debería añadir un producto a favoritos', async () => {
            const response = await agent
                .post('/api/producto/favourites')
                .send({ productId });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Producto añadido a favoritos correctamente' });

            // Verificar que el producto ha sido añadido a los favoritos del usuario
            const usuarioActualizado = await Usuario.findById(userId);
            expect(usuarioActualizado.Favoritos).toContainEqual(productId);
        });

        it('debería responder con un mensaje de error si no está autorizado', async () => {
            const response = await request(app)
                .post('/api/producto/favourites')
                .send({ productId });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Acceso no autorizado' });
        });
    });

    describe('DELETE /api/producto/deletefavourites', () => {

        it('debería eliminar un producto de favoritos', async () => {
            const response = await agent
                .post('/api/producto/deletefavourites')
                .send({ productId });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Producto eliminado de favoritos correctamente' });

            // Verificar que el producto ha sido eliminado de los favoritos del usuario
            const usuarioActualizado = await Usuario.findById(userId);
            expect(usuarioActualizado.Favoritos).not.toContainEqual(productId);
        });

        it('debería responder con un mensaje de error si no está autorizado', async () => {
            const response = await request(app)
                .post('/api/producto/deletefavourites')
                .send({ productId });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Acceso no autorizado' });
        });
    });
});
