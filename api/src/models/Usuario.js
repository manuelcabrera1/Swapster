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
    Productos_vendidos:{
        type: Array
    },
    Productos_comprados:{
        type: Array
    }

}, {
    timestamps: true // Agrega timestamps automáticamente (createdAt, updatedAt)
});

module.exports = mongoose.model('Usuarios', UsuarioSchema)
