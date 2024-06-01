const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/src/app');
const Producto = require('../api/src/models/Producto');
const Usuario = require('../api/src/models/Usuario');

describe('POST /api/producto/create', () => {
    let agent;
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Conectar Mongoose al servidor de MongoDB en memoria
        await mongoose.connect(mongoUri);

        // Crear un usuario de prueba en la base de datos
        const usuario = new Usuario({
            Nombre: 'Test5',
            Apellidos: 'Apellido de prueba',
            Direccion: '123 Calle Principal',
            Correo: 'test5@example.com',
            Password: 'password',
            Rol: 'user',
            Productos_vendidos: [],
            Productos_comprados: [],
        });
        await usuario.save();

        // Iniciar sesión como usuario simulado
        agent = request.agent(app);
        const loginResponse = await agent.post('/api/usuario/auth/login').send({
            correo: 'test5@example.com',
            contraseña: 'password',
        });

        if (loginResponse.status !== 200) {
            throw new Error(`Error al iniciar sesión: ${loginResponse.status}`);
        }
    });

    afterAll(async () => {
        await Producto.deleteMany({ Nombre: 'Test5' });
        await Usuario.deleteMany({ Nombre: 'Test5' });
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    it('debería vender un producto con éxito', async () => {
        // Crear un producto simulado
        const producto = {
            Nombre: 'Test5',
            Descripcion: 'Descripción de prueba',
            Precio: 10,
            Imagen: 'imagen.jpg',
        };

        // Enviar una solicitud para vender el producto
        const response = await agent.post('/api/producto/create').send(producto);

        // Verificar el estado de la respuesta y el contenido
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('producto');
        expect(response.body.producto).toHaveProperty('Nombre', producto.Nombre);
        expect(response.body.producto).toHaveProperty('Descripcion', producto.Descripcion);
        expect(response.body.producto).toHaveProperty('Precio', producto.Precio);
        expect(response.body.producto).toHaveProperty('Imagen', producto.Imagen);

        // Verificar que el usuario tenga el producto vendido
        const usuario = await Usuario.findOne({ Correo: 'test5@example.com' }).populate('Productos_vendidos');
        const productoVendido = usuario.Productos_vendidos.find(prod => prod._id.toString() === response.body.producto._id);
        expect(productoVendido).not.toBeUndefined();
    });
});
