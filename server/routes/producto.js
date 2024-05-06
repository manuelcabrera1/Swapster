const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto'); // Importar el modelo de Producto

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener un producto por su _id
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Producto.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const {Nombre, Descripcion, Precio, Unidades, Usuario, Imagen } = req.body;
        const newProducto = new Producto({Nombre, Descripcion, Precio, Unidades, Usuario, Imagen });
        const savedProducto = await newProducto.save();
        res.status(201).json(savedProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el producto' });
    }
});


// Actualizar un producto por su ID (_id)
router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProducto = await Producto.findByIdAndUpdate(productId, req.body, { new: true });

        if (!updatedProducto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProducto);
    } catch (error) {
        console.error('Error al actualizar el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Eliminar un producto por su _id
router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Producto.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
