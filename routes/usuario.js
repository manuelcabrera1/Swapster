const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener un usuario por su ID
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { Nombre, Apellidos, Direccion, Correo, Tipo } = req.body;
        const newUser = new Usuario({ Nombre, Apellidos, Direccion, Correo, Tipo });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el usuario' });
    }
});

// Actualizar un usuario por su ID
router.put('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUser = await Usuario.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar el usuario por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Eliminar un usuario por su ID
router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await Usuario.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
