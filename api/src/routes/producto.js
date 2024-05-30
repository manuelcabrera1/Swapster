const express = require('express');
const router = express.Router();
const {getAllProducts, venderProducto, getProductById, updateProductById, deleteProductById} = require('../controllers/producto.controller')
const {comprobarAutenticacion, rolesPermitidos} = require('../middleware/roles')

// Obtener todos los productos
router.route('/').get(getAllProducts);
router.route('/create').post(venderProducto);
router.route('/:productId')
    .get(getProductById)
    .put(updateProductById)
    .delete(deleteProductById);


module.exports = router;
