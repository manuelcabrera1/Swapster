const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

  


// Crear una cuenta nueva
router.post('/', async (req, res) => {
    try {
        const { Nombre, Apellidos, Direccion, Correo, Password, Tipo, Productos_vendidos, Productos_comprados} = req.body;
        const newUser = new Usuario({ Nombre, Apellidos, Direccion, Correo, Tipo , Password, Productos_vendidos: Productos_vendidos || [], Productos_comprados: Productos_comprados});
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
