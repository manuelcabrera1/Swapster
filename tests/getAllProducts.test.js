const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');

describe('Get All Products API tests', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Crear algunos productos
        await Producto.create([
            {
                Nombre: 'Producto_1',
                Descripcion: 'Descripción del Producto 1',
                Precio: 100,
                Categoria: 'Categoría 1',
                Imagen: 'imagen1.jpg',
                IdComprador: null,
                createdAt: new Date('2023-01-01')
            },
            {
                Nombre: 'Producto_2',
                Descripcion: 'Descripción del Producto 2',
                Precio: 200,
                Categoria: 'Categoría 2',
                Imagen: 'imagen2.jpg',
                IdComprador: null,
                createdAt: new Date('2023-01-02')
            },
            {
                Nombre: 'Producto_3',
                Descripcion: 'Descripción del Producto 3',
                Precio: 300,
                Categoria: 'Categoría 3',
                Imagen: 'imagen3.jpg',
                IdComprador: null,
                createdAt: new Date('2023-01-03')
            }
        ]);
    });

    afterAll(async () => {
        await Producto.deleteMany({Nombre: 'Producto_3'});
        await Producto.deleteMany({Nombre: 'Producto_1'});
        await Producto.deleteMany({Nombre: 'Producto_2'});
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('debería obtener todos los productos', async () => {
        const response = await request(app).get('/api/producto');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(3);

        // Se crean por orden descendente
        expect(response.body[0].Nombre).toBe('Producto_3');
        expect(response.body[1].Nombre).toBe('Producto_2');
        expect(response.body[2].Nombre).toBe('Producto_1');
    });
});
