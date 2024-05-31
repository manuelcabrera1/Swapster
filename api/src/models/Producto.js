const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: true
    },
    Precio: {
        type: Number,
        required: true
    },
    Categoria: {
        type: String,
    },
    Imagen: {
        type: String,
    },
    IdComprador: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
        default:null
    }
}, {
    timestamps: true // Agrega timestamps automáticamente (createdAt, updatedAt)
});

module.exports = mongoose.model('Producto', ProductoSchema)
