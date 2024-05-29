const express = require('express');
const router = express.Router();
const {crearCuenta, getUserById, login, logout, getSession} = require('../controllers/usuario.controller')
const {comprobarAutenticacion, rolesPermitidos} = require('../middleware/roles')

router.route('/')
    .post(crearCuenta);

router.route('/:userId').get(comprobarAutenticacion, rolesPermitidos('user'), getUserById);
router.route('/auth/login').post(login);
router.route('/auth/logout').post(logout);
router.route('/auth/session').get(getSession);




module.exports = router;
