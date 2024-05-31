const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    Apellidos: {
        type: String,
        required: true
    },
    Direccion: {
        type: String,
        required: true
    },
    Correo: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    Rol: {
        type: String,
        required: true,
        enum: ['user', 'admin']
    },
    Productos_vendidos: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto' 
    }], 
    Productos_comprados: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto' 
    }], 
    Favoritos: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Producto' 
    }]

}, {
    timestamps: true // Agrega timestamps automáticamente (createdAt, updatedAt)
});

module.exports = mongoose.model('Usuario', UsuarioSchema)
