const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');
const Usuario = require('../api/src/models/Usuario');

describe('Producto API tests', () => {
    let productId;
    let agent;
    let mongoServer;
    let userId;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Crear un usuario para la prueba
        const usuario = new Usuario({
            Nombre: 'Test',
            Apellidos: 'User',
            Correo: 'testuser_update_delete@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'admin'
        });
        const savedUsuario = await usuario.save();
        userId = savedUsuario._id;

        // Autenticar al usuario y obtener la cookie de sesión
        agent = request.agent(app);
        const loginResponse = await agent
            .post('/api/usuario/auth/login')
            .send({ correo: 'testuser_update_delete@example.com', contraseña: 'password' });

        expect(loginResponse.status).toBe(200); // Verificar que el login fue exitoso

        // Crear un producto para la prueba
        const producto = new Producto({
            Nombre: 'Test3',
            Descripcion: 'Descripción de prueba',
            Precio: 10,
            Categoria: 'Prueba',
            Imagen: 'imagen.jpg',
        });
        const savedProducto = await producto.save();
        productId = savedProducto._id;
    });
    

    afterAll(async () => {
        await Producto.deleteMany({ Nombre: 'Test3' });
        await Usuario.deleteMany({ Correo: 'testuser_update_delete@example.com' });
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('PUT /api/producto/:productId', () => {
        it('debería actualizar un producto existente', async () => {
            const updatedFields = {
                Descripcion: 'Nueva descripción',
                Precio: 15,
                Categoria: 'Nueva categoría',
            };

            const response = await agent
                .put(`/api/producto/${productId}`)
                .send(updatedFields);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('Nombre', 'Test3');
            expect(response.body).toHaveProperty('Descripcion', 'Nueva descripción');
            expect(response.body).toHaveProperty('Precio', 15);
            expect(response.body).toHaveProperty('Categoria', 'Nueva categoría');
            expect(response.body).toHaveProperty('Imagen', 'imagen.jpg');
        });

        it('debería responder con un mensaje de error si el producto no se encuentra para actualizar', async () => {
            const nonExistentProductId = new mongoose.Types.ObjectId();
            const updatedFields = {
                Descripcion: 'Nueva descripción',
                Precio: 15,
                Categoria: 'Nueva categoría',
            };

            const response = await agent
                .put(`/api/producto/${nonExistentProductId}`)
                .send(updatedFields);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Producto no encontrado' });
        });
    });

    describe('DELETE /api/producto/:productId', () => {
        it('debería eliminar un producto existente', async () => {
            const response = await agent.delete(`/api/producto/${productId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Producto eliminado correctamente' });

            // Verificar que el producto ha sido eliminado de la base de datos
            const deletedProducto = await Producto.findById(productId);
            expect(deletedProducto).toBeNull();
        });

        it('debería responder con un mensaje de error si el producto no se encuentra para eliminar', async () => {
            const nonExistentProductId = new mongoose.Types.ObjectId();

            const response = await agent.delete(`/api/producto/${nonExistentProductId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Producto no encontrado' });
        });
    });
});
