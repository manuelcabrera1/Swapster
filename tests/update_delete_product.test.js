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


        const admin = new Usuario({
            Nombre: 'Test',
            Apellidos: 'User',
            Correo: 'admintest_update_delete@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'admin'
        });

        const savedAdmin = await admin.save();
        adminId = savedAdmin._id;

        adminAgent = request.agent(app);
        const loginResponseA = await adminAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'admintest_update_delete@example.com', contraseña: 'password' });

        expect(loginResponseA.status).toBe(200); // Verificar que el login fue exitoso


        const savedProducto = await Producto.create({
            Nombre: 'Test3',
            Descripcion: 'Descripción de prueba',
            Precio: 10,
            Categoria: 'Prueba',
            Imagen: 'imagen.jpg',
        });
        productId = savedProducto._id;
        
        

        // Crear un usuario para la prueba
        const usuario = new Usuario({
            Nombre: 'Test',
            Apellidos: 'User',
            Correo: 'testuser_update_delete@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'user',
            Productos_vendidos: [productId]
        });
        const savedUsuario = await usuario.save();
        userId = savedUsuario._id;

        // Autenticar al usuario y obtener la cookie de sesión
        userAgent = request.agent(app);
        const loginResponseU = await userAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'testuser_update_delete@example.com', contraseña: 'password' });

        expect(loginResponseU.status).toBe(200); // Verificar que el login fue exitoso

        // Crear un producto para la prueba
        

    });
    

    afterAll(async () => {
        await Producto.deleteMany({ Nombre: 'Test3' });
        await Usuario.deleteMany({ Correo: 'testuser_update_delete@example.com' });
        await Usuario.deleteMany({ Correo: 'admintest_update_delete@example.com' });
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

            const response = await userAgent
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

            const response = await userAgent
                .put(`/api/producto/${nonExistentProductId}`)
                .send(updatedFields);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Producto no encontrado' });
        });
    });

    describe('DELETE /api/producto/:productId', () => {
        it('debería eliminar un producto existente', async () => {
            const response = await adminAgent.delete(`/api/producto/${productId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Producto eliminado correctamente' });

            // Verificar que el producto ha sido eliminado de la base de datos
            const deletedProducto = await Producto.findById(productId);
            expect(deletedProducto).toBeNull();
        });

        it('debería responder con un mensaje de error si el producto no se encuentra para eliminar', async () => {
            const nonExistentProductId = new mongoose.Types.ObjectId();

            const response = await adminAgent.delete(`/api/producto/${nonExistentProductId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Producto no encontrado' });
        });
    });
});
