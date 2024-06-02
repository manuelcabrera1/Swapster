const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');

describe('GET /api/producto/:productId', () => {
    let productId;
    let agent;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Crear un producto para la prueba
        const producto = new Producto({
            Nombre: 'Test1',
            Descripcion: 'Descripción de prueba',
            Precio: 10,
            Categoria: 'Prueba',
            Imagen: 'imagen.jpg',
        });
        const savedProducto = await producto.save();
        productId = savedProducto._id;

        agent = request.agent(app);
    });

    afterAll(async () => {
        await Producto.deleteMany({ Nombre: 'Test1' });
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        // Limpiar la base de datos después de cada prueba
        jest.restoreAllMocks();
        await Producto.deleteMany({ Nombre: 'Test1' });
    });

    it('debería responder con un producto y un mensaje de éxito', async () => {
        const response = await agent.get(`/api/producto/${productId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', productId.toString());
        expect(response.body).toHaveProperty('Nombre', 'Test1');
        expect(response.body).toHaveProperty('Descripcion', 'Descripción de prueba');
        // Agrega más expectativas según los campos de tu modelo Producto
    });

    it('debería responder con un mensaje de error si el producto no se encuentra', async () => {
        const nonExistentProductId = new mongoose.Types.ObjectId();
        const response = await agent.get(`/api/producto/${nonExistentProductId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual('Producto no encontrado');
    });

});
