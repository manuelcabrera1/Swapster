const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    IdUsuario: {
        type: Number,
        required: true,
        unique: true
    },
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
    Tipo: {
        type: String,
        required: true,
    }

}, {
    timestamps: true // Agrega timestamps automáticamente (createdAt, updatedAt)
});

module.exports = mongoose.model('Usuarios', UsuarioSchema)
