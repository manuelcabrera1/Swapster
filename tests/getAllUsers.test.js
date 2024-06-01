const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Usuario = require('../api/src/models/Usuario');

describe('GET /api/usuario', () => {
    let agent;
    let adminId;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        //Crear un user normal
        const user = new Usuario({
            Nombre: 'User',
            Apellidos: 'Normal',
            Correo: 'user_getAll@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'user'
        });

        const savedUser = await user.save();
        userId = savedUser._id;

        // Crear un usuario administrador para la prueba
        const admin = new Usuario({
            Nombre: 'Admin',
            Apellidos: 'User',
            Correo: 'admin_getAll@example.com',
            Password: 'password',
            Direccion: '123 Calle Principal',
            Rol: 'admin'
        });
        const savedAdmin = await admin.save();
        adminId = savedAdmin._id;


        // Iniciar sesión como administrador
        userAgent = request.agent(app);
        const userResponse= await userAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'user_getAll@example.com', contraseña: 'password' });

        expect(userResponse.status).toBe(200); // Verificar que el login del admin fue exitoso 

        // Iniciar sesión como administrador
        adminAgent = request.agent(app);
        const adminResponse = await adminAgent
            .post('/api/usuario/auth/login')
            .send({ correo: 'admin_getAll@example.com', contraseña: 'password' });

        expect(adminResponse.status).toBe(200); // Verificar que el login del admin fue exitoso 
    });

    afterAll(async () => {
        await Usuario.deleteMany({Correo:'admin_getAll@example.com'});
        await Usuario.deleteMany({Correo:'user_getAll@example.com'});
        await Usuario.deleteMany({Correo:'user111@example.com'});
        await Usuario.deleteMany({Correo:'user222@example.com'});
        await mongoose.disconnect();
        await mongoServer.stop();
    });

   
    it('debería obtener todos los usuarios con rol "user"', async () => {
        // Crear algunos usuarios con rol "user"
        const user1 = new Usuario({
            Nombre: 'User1',
            Apellidos: 'Test',
            Correo: 'user111@example.com',
            Password: 'password',
            Direccion: '123 Calle Secundaria',
            Rol: 'user'
        });

        const user2 = new Usuario({
            Nombre: 'User2',
            Apellidos: 'Test',
            Correo: 'user222@example.com',
            Password: 'password',
            Direccion: '123 Calle Secundaria',
            Rol: 'user'
        });

        await user1.save();
        await user2.save();

        // Autenticar como administrador para realizar la solicitud
        const response = await adminAgent.get('/api/usuario')

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        expect(response.body[0]).toHaveProperty('Nombre');
        expect(response.body[0]).toHaveProperty('Apellidos');
        expect(response.body[0]).toHaveProperty('Correo');
        expect(response.body[0]).toHaveProperty('Rol', 'user');
    });

    it('debería responder con un mensaje de error si no hace la solicitud un administrador', async () => {
        const response = await userAgent.get('/api/usuario');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'No autorizado' });
    });
});
