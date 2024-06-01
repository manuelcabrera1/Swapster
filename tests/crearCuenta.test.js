const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Usuario = require('../api/src/models/Usuario');

describe('POST /api/usuario/', () => {
    let agent;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        agent = request.agent(app);
    });

    afterAll(async () => {
        await Usuario.deleteMany({ Nombre: 'Juan'});
        await Usuario.deleteMany({ Nombre: 'Carlos'});
        await Usuario.deleteMany({ Nombre: 'Luis'});
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        await Usuario.deleteMany({ Nombre: 'Juan'});
        await Usuario.deleteMany({ Nombre: 'Carlos'});
        await Usuario.deleteMany({ Nombre: 'Luis'});
    });

    it('debería crear un nuevo usuario con éxito', async () => {
        const newUser = {
            Nombre: 'Juan',
            Apellidos: 'Pérez',
            Direccion: 'Calle Falsa 123',
            Correo: 'juan.perez@example.com',
            Password: 'password123',
        };

        const response = await agent.post('/api/usuario/').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('Nombre', 'Juan');
        expect(response.body).toHaveProperty('Apellidos', 'Pérez');
        expect(response.body).toHaveProperty('Direccion', 'Calle Falsa 123');
        expect(response.body).toHaveProperty('Correo', 'juan.perez@example.com');
    });

    it('debería responder con un error si el correo ya está registrado', async () => {
        // Simulamos la existencia del usuario en la base de datos
        jest.spyOn(Usuario, 'findOne').mockResolvedValue({
            Nombre: 'Juan',
            Apellidos: 'Pérez',
            Direccion: 'Calle Falsa 123',
            Correo: 'juan.perez@example.com',
            Password: 'password123',
        });
    
        const newUser = {
            Nombre: 'Carlos',
            Apellidos: 'González',
            Direccion: 'Avenida Siempre Viva 456',
            Correo: 'juan.perez@example.com', // Usamos el mismo correo electrónico que el usuario existente
            Password: 'password456',
        };
    
        const response = await agent.post('/api/usuario/').send(newUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'El correo electrónico ya está registrado' });
    });

    it('debería responder con un error si ocurre un error en el servidor', async () => {
        jest.spyOn(Usuario.prototype, 'save').mockRejectedValue(new Error('Internal Server Error'));

        const newUser = {
            Nombre: 'Luis',
            Apellidos: 'Martínez',
            Direccion: 'Plaza Mayor 789',
            Correo: 'luis.martinez@example.com',
            Password: 'password789',
        };

        const response = await agent.post('/api/usuario/').send(newUser);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Hubo un problema al crear el usuario' });
    });
});
