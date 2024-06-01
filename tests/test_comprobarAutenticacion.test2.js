const express = require('express');
const request = require('supertest');
const session = require('express-session');

const { comprobarAutenticacion, rolesPermitidos } = require('../api/src/middleware/roles');

// Mockeo del modelo de usuario
const Usuario = require('../api/src/models/Usuario');
jest.mock('../api/src/models/Usuario');

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));

// Ruta de prueba que usa los middlewares
app.get('/test-auth', comprobarAutenticacion, (req, res) => {
  res.status(200).json({ message: 'Acceso concedido' });
});

app.get('/test-role', comprobarAutenticacion, rolesPermitidos('admin'), (req, res) => {
  res.status(200).json({ message: 'Acceso concedido' });
});

describe('Middleware comprobarAutenticacion', () => {
  it('debería permitir el acceso cuando el usuario está autenticado', async () => {
    const mockUsuario = { _id: '123', Rol: 'user' };
    Usuario.findById.mockResolvedValue(mockUsuario);

    const agent = request.agent(app);
    await agent
      .post('/test-auth')
      .set('Cookie', 'connect.sid=s%3A123')
      .send();

    const res = await agent.get('/test-auth').set('Cookie', 'connect.sid=s%3A123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Acceso concedido');
  });

  it('debería denegar el acceso cuando el usuario no está autenticado', async () => {
    Usuario.findById.mockResolvedValue(null);

    const res = await request(app).get('/test-auth');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Acceso no autorizado');
  });

  it('debería manejar errores del servidor', async () => {
    Usuario.findById.mockRejectedValue(new Error('Error'));

    const agent = request.agent(app);
    await agent
      .post('/test-auth')
      .set('Cookie', 'connect.sid=s%3A123')
      .send();

    const res = await agent.get('/test-auth').set('Cookie', 'connect.sid=s%3A123');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Acceso no autorizado');
  });
});

describe('Middleware rolesPermitidos', () => {
  it('debería permitir el acceso cuando el usuario tiene el rol adecuado', async () => {
    const mockUsuario = { _id: '123', Rol: 'admin' };
    Usuario.findById.mockResolvedValue(mockUsuario);

    const agent = request.agent(app);
    await agent
      .post('/test-role')
      .set('Cookie', 'connect.sid=s%3A123')
      .send();

    const res = await agent.get('/test-role').set('Cookie', 'connect.sid=s%3A123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Acceso concedido');
  });

  it('debería denegar el acceso cuando el usuario no tiene el rol adecuado', async () => {
    const mockUsuario = { _id: '123', Rol: 'user' };
    Usuario.findById.mockResolvedValue(mockUsuario);

    const agent = request.agent(app);
    await agent
      .post('/test-role')
      .set('Cookie', 'connect.sid=s%3A123')
      .send();

    const res = await agent.get('/test-role').set('Cookie', 'connect.sid=s%3A123');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No autorizado');
  });

  it('debería denegar el acceso cuando el usuario no está autenticado', async () => {
    Usuario.findById.mockResolvedValue(null);

    const res = await request(app).get('/test-role');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No autorizado');
  });
});
