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
    Vendido: {
        type:Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega timestamps automáticamente (createdAt, updatedAt)
});

module.exports = mongoose.model('Producto', ProductoSchema)
