const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Usuario = require('../api/src/models/Usuario');

describe('GET /api/usuario/:userId', () => {
    let userId;
    let agent;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const user = new Usuario({
            Nombre: 'Test2',
            Apellidos: 'User',
            Direccion: '123 Test St',
            Correo: 'test2@example.com',
            Password: 'password',
            Rol: 'user',
            Productos_vendidos: [],
            Productos_comprados: [],
        });
        const savedUser = await user.save();
        userId = savedUser._id;

        agent = request.agent(app);

        await agent.post('/api/usuario/auth/login').send({
            correo: 'test2@example.com',
            contraseña: 'password',
        });
    });

    afterAll(async () => {
        await Usuario.deleteMany({ Nombre: 'Test2', Correo: 'test2@example.com' });
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('debería responder con un usuario y un mensaje de éxito', async () => {
        const response = await agent.get(`/api/usuario/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', userId.toString());
        expect(response.body).toHaveProperty('Nombre', 'Test2');
        expect(response.body).toHaveProperty('Correo', 'test2@example.com');
    });

    it('debería responder con un mensaje de error si el usuario no se encuentra', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        const response = await agent.get(`/api/usuario/${nonExistentUserId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Usuario no encontrado' });
    });

    it('debería responder con un mensaje de error si ocurre un error en el servidor', async () => {
        jest.spyOn(Usuario, 'findById').mockRejectedValue(new Error('Internal Server Error'));
    
        const response = await agent.get(`/api/usuario/${userId}`);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Acceso no autorizado' });
    });
});
