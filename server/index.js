const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productoRoutes = require('./routes/producto');
const usuarioRoutes = require('./routes/usuario');

const app = express();
app.use(cors());
app.use(express.json());
// Configuración de conexión a la base de datos MongoDB
require('./db/mongodb');

// Rutas para productos
app.use('/api/productos', productoRoutes);

// Rutas para usuarios
app.use('/api/usuarios', usuarioRoutes);

const Usuario = require('./models/Usuario');

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
