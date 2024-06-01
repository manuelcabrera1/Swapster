const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Usuario = require('../api/src/models/Usuario');
const Producto = require('../api/src/models/Producto');

describe('Usuario API tests', () => {
    let mongoServer;
    let userAgent;
    let adminAgent;
    let userId;
    let adminId;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Crear un usuario normal para la prueba
        const usuario = new Usuario({
            Nombre: 'Usuario',
            Apellidos: 'Normal',
            Correo: 'usuario_updel@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'user'
        });
        const savedUsuario = await usuario.save();
        userId = savedUsuario._id;

        // Crear un usuario administrador para la prueba
        const admin = new Usuario({
            Nombre: 'Admin',
            Apellidos: 'Usuario',
            Correo: 'admin_updel@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'admin'
        });
        const savedAdmin = await admin.save();
        adminId = savedAdmin._id;

        // Iniciar sesión como usuario normal
        userAgent = request.agent(app);
        const userResponse = await userAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'usuario_updel@example.com', contraseña: 'password' });

        expect(userResponse.status).toBe(200); // Verificar que el login fue exitoso

        // Iniciar sesión como administrador
        adminAgent = request.agent(app);
        const adminResponse = await adminAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'admin_updel@example.com', contraseña: 'password' });

        expect(adminResponse.status).toBe(200); // Verificar que el login fue exitoso
    });

    afterAll(async () => {
        await Usuario.deleteMany({ Correo: 'usuario_updel@example.com' });
        await Usuario.deleteMany({ Correo: 'admin_updel@example.com' });
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('PUT /api/usuario/:id', () => {
        it('debería modificar un usuario existente', async () => {
            const response = await userAgent
                .put(`/api/usuario/${userId}`)
                .send({
                    Nombre: 'Usuario Modificado',
                    Apellidos: 'Normal',
                    Direccion: 'Calle Verdadera 456',
                    Correo: 'usuario_modificado@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Usuario modificado correctamente');

            // Verificar que el usuario ha sido modificado en la base de datos
            const modifiedUser = await Usuario.findById(userId);
            expect(modifiedUser.Nombre).toBe('Usuario Modificado');
            expect(modifiedUser.Correo).toBe('usuario_modificado@example.com');
        });

        it('debería responder con un mensaje de error si el usuario no se encuentra para modificar', async () => {
            const nonExistentUserId = new mongoose.Types.ObjectId();

            const response = await userAgent
                .put(`/api/usuario/${nonExistentUserId}`)
                .send({
                    Nombre: 'Usuario Modificado',
                    Apellidos: 'Normal',
                    Direccion: 'Calle Verdadera 456',
                    Correo: 'usuario_modificado@example.com'
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Usuario no encontrado');
        });
    });

    describe('DELETE /api/usuario/:id', () => {
        it('debería eliminar un usuario como administrador', async () => {
            const response = await adminAgent
                .delete(`/api/usuario/${userId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Usuario eliminado correctamente');

            // Verificar que el usuario ha sido eliminado de la base de datos
            const deletedUser = await Usuario.findById(userId);
            expect(deletedUser).toBeNull();
        });

        it('debería responder con un mensaje de error si el usuario no se encuentra para eliminar', async () => {
            const nonExistentUserId = new mongoose.Types.ObjectId();

            const response = await adminAgent
                .delete(`/api/usuario/${nonExistentUserId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Usuario no encontrado');
        });
    });
});
