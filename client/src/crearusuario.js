import React, { useState } from 'react';
import axios from 'axios';
//import './App.css'; // Importar tu archivo CSS personalizado
import '../src/Stylesheets/login.css';

const App = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      Nombre: nombre,
      Apellidos: apellidos,
      Direccion: direccion,
      Correo: correo,
      Tipo: 'user'
    };

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', formData);
      console.log('Usuario creado:', response.data);
      setMensaje('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setMensaje('Hubo un problema al crear el usuario');
    }
  };

  return (
    <body>
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <h1>Crear Cuenta</h1>
        <input type="text" required placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" required placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
        <input type="text" required placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <input type="email" required placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <button type="submit">Confirmar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </body>
  );
};

export default App;
