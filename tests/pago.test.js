const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');
const Usuario = require('../api/src/models/Usuario');
const stripe = require('stripe');

// Mock de Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn((data) => {
        if (!data.payment_method) {
          return Promise.reject({ raw: { message: 'Error al procesar el pago' } });
        }
        return Promise.resolve({
          id: 'pi_1F8fQg2eZvKYlo2CgB0JQ7eP',
          amount: data.amount,
          currency: 'eur',
          description: data.description,
          payment_method: data.payment_method,
          status: 'succeeded'
        });
      })
    }
  }));
});

describe('POST /api/payment/checkout', () => {
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
      Correo: 'testuserpay@example.com',
      Password: 'password',
      Rol: 'user',
      Productos_vendidos: [],
      Productos_comprados: [],
      Favoritos: []
    });
    const savedUsuario = await usuario.save();
    userId = savedUsuario._id;
  });

  afterAll(async () => {
    await Producto.deleteMany({Nombre:'Test Producto'});
    await Usuario.deleteMany({Correo:'testuserpay@example.com'});
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Producto.deleteMany({});

    agent = request.agent(app);
    const loginResponse = await agent.post('/api/usuario/auth/login').send({
      correo: 'testuserpay@example.com',
      contraseña: 'password',
    });

    if (loginResponse.status !== 200) {
      throw new Error(`Error al iniciar sesión: ${loginResponse.status}`);
    }

    const producto = new Producto({
      Nombre: 'Test Producto',
      Descripcion: 'Descripción de prueba',
      Precio: 10,
      Categoria: 'Prueba',
      Imagen: 'imagen.jpg',
    });
    const savedProducto = await producto.save();
    productId = savedProducto._id;
  });

  it('debería procesar un pago exitosamente', async () => {
    const response = await agent
      .post('/api/payment/checkout')
      .set('Authorization', `Bearer ${process.env.STRIPE_PRIVATE_KEY}`)
      .send({ id: 'pm_card_visa', idProducto: productId, amount: 1000 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Pago exitoso');
  });

  it('debería responder con un error si el producto no se encuentra', async () => {
    const nonExistentProductId = new mongoose.Types.ObjectId();
    const response = await agent
      .post('/api/payment/checkout')
      .set('Authorization', `Bearer ${process.env.STRIPE_PRIVATE_KEY}`)
      .send({ id: 'pm_card_visa', idProducto: nonExistentProductId, amount: 1000 });

    expect(response.status).toBe(404);
    expect(response.body).toBe('Producto no encontrado');
  });

  it('debería responder con un error si el usuario intenta comprar su propio producto', async () => {
    await Usuario.findByIdAndUpdate(userId, { $push: { Productos_vendidos: productId } });
    const response = await agent
      .post('/api/payment/checkout')
      .set('Authorization', `Bearer ${process.env.STRIPE_PRIVATE_KEY}`)
      .send({ id: 'pm_card_visa', idProducto: productId, amount: 1000 });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No puedes comprar Productos puestos a la venta por ti');
  });

  it('debería manejar errores en el procesamiento del pago', async () => {
    const response = await agent
      .post('/api/payment/checkout')
      .set('Authorization', `Bearer ${process.env.STRIPE_PRIVATE_KEY}`)
      .send({ id: '', idProducto: productId, amount: 1000 });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error al procesar el pago');
  });
});
