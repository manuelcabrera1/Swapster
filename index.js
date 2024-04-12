const express = require('express');
const mongoose = require('mongoose');
const productoRoutes = require('./routes/producto');
const usuarioRoutes = require('./routes/usuario');

const app = express();

// Configuración de conexión a la base de datos MongoDB
require('./db/mongodb');

// Rutas para productos
app.use('/api/productos', productoRoutes);

// Rutas para usuarios
app.use('/api/usuarios', usuarioRoutes);

// Puerto de escucha
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
