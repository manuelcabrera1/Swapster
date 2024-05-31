const express = require('express');
const router = express.Router();
const {getAllProducts, venderProducto, addToFavourites, deleteFromFavourites,getProductById, updateProductById, deleteProductById} = require('../controllers/producto.controller')
const {comprobarAutenticacion, rolesPermitidos} = require('../middleware/roles')

// Obtener todos los productos
router.route('/').get(getAllProducts);
router.route('/create').post(comprobarAutenticacion, rolesPermitidos('user'), venderProducto);
router.route('/favourites').post(comprobarAutenticacion, rolesPermitidos('user'), addToFavourites);
router.route('/deletefavourites').post(comprobarAutenticacion, rolesPermitidos('user'), deleteFromFavourites);

router.route('/:productId')
    .get(getProductById)
    .put(comprobarAutenticacion, updateProductById)
    .delete(comprobarAutenticacion, deleteProductById);


module.exports = router;
