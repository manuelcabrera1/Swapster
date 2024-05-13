const express = require("express");
var router = express.Router();
const Usuario = require("../models/Usuario");



router.post('/', async (req, res) => {
    try {
        const {correo, contraseña} = req.body;

        var result=await Usuario.findOne({Correo: correo, Password: contraseña});

        if (result)
        {
            res.status(200).json(result)
            req.session.usuario = result;
        }
        else 
            res.status(400).json("Usuario no encontrado")

    } catch (error) {
        console.error('Error al iniciar sesion', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
