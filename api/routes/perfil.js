var express = require ("express");
var router = express.Router();
const Producto = require('../models/Producto'); // Importar el modelo de Producto



router.get('/', async (req, res) => {
    try {
        
        if (productos)
            res.json(productos);
        
    } catch (error) {
        console.error('Error al listar los productos en venta', error);
        res.status(500).json({ error: 'Hubo un problema al listar los poductos ' });
    }
});


module.exports = router;
