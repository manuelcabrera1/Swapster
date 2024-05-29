var express = require ("express");
var router = express.Router();
const Producto = require('../models/Producto'); // Importar el modelo de Producto
const {rolesPermitidos} = require('../middleware/roles');



router.get('/', rolesPermitidos('user'), async (req, res) => {
    try {
        res.json("Vista del panel de admin");
        
    } catch (error) {
        console.error('Error al listar los productos en venta', error);
        res.status(500).json({ error: 'Hubo un problema al listar los poductos ' });
    }   
});


module.exports = router;
