const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Usuario = require('../api/src/models/Usuario');

describe('Pruebas para la autenticación de usuarios', () => {
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

        const usuario = new Usuario({
            Nombre: 'John',
            Apellidos: 'Doe',
            Direccion: '1',
            Correo: 'john.doe@example.com',
            Password: 'password123',
            Rol: 'user'
        });
        await usuario.save();
    });

    afterAll(async () => {
        await Usuario.deleteMany({ Nombre: 'John'});
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(() => {
        agent = request.agent(app);
    });

    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
        const loginResponse = await agent.post('/api/usuario/auth/login').send({
            correo: 'john.doe@example.com',
            contraseña: 'password123',
        });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toEqual({ message: 'Inicio de sesión exitoso' });
    });

    // Agrega los otros casos de prueba aquí...


    // Los otros casos de prueba no necesitan crear el usuario, ya que se crea antes de cada prueba

    it('debería responder con un error si se proporcionan credenciales incorrectas', async () => {
        const response = await agent.post('/api/usuario/auth/login').send({
            correo: 'john.doe@example.com',
            contraseña: 'contraseñaincorrecta',
        });
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Contraseña incorrecta' });
    });
    
    it('debería responder con un error si el usuario no existe', async () => {
        const response = await agent.post('/api/usuario/auth/login').send({
            correo: 'usuarioinexistente@example.com',
            contraseña: 'contraseña',
        });
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Usuario no encontrado' });
    });
    
    it('debería responder con un error si no se encuentra una sesión activa', async () => {
        const response = await agent.get('/api/usuario/auth/session');
    
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Acceso no autorizado' });
    });
});
