const express = require('express');
const router = express.Router();
const {getAllUsers, crearCuenta, getUserById, login, logout, getSessionData, modifyUserById, deleteUserById} = require('../controllers/usuario.controller')
const {comprobarAutenticacion, rolesPermitidos} = require('../middleware/roles')

router.route('/')
    .get(comprobarAutenticacion, rolesPermitidos('admin'), getAllUsers)
    .post(crearCuenta)

router.route('/:id')
    .get(comprobarAutenticacion, getUserById)
    .put(comprobarAutenticacion, modifyUserById)
    .delete(comprobarAutenticacion, rolesPermitidos('admin'), deleteUserById);

router.route('/auth/login').post(login);
router.route('/auth/logout').post(comprobarAutenticacion, logout);
router.route('/auth/session').get(comprobarAutenticacion, getSessionData);




module.exports = router;
