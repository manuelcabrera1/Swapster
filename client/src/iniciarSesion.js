import React, { useState } from 'react';
import axios from 'axios';
//import './App.css'; 
import './Stylesheets/login.css';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        correo,
        contraseña
      });
      console.log('Inicio de sesión exitoso:', response.data);
      setMensaje('Inicio de sesión exitoso');
      // Aquí podrías redirigir al usuario o guardar el token de sesión, etc.
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Error al iniciar sesión, verifica tus credenciales');
    }
  };

  return (
    <body>
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>

        <form onSubmit={handleSubmit}>
            <h1>Iniciar Sesión</h1>
            
            <label for="correo">Correo</label>
            <input id="correo" type="email" value={correo} placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} required
            />

            <label for="contraseña">Contraseña</label>
            <input id="contraseña" type={mostrarContraseña ? "text" : "password"} value={contraseña} placeholder="Contraseña" onChange={(e) => setContraseña(e.target.value)} required
            />

            <label className="checkbox-container">
                <input
                    type="checkbox"
                    checked={mostrarContraseña}
                    onChange={(e) => setMostrarContraseña(e.target.checked)}
                />
                <span className="checkmark"></span>
                Mostrar contraseña

            </label>

            <div class="actions">
                <button type="button" onClick={() => {/* Lógica para volver a la página de inicio */}}>Cancelar</button>
                <button type="submit">Iniciar Sesión</button>
            </div>

            {mensaje && <p>{mensaje}</p>}

            <div className="links">
            <a href="/recordar-contraseña">¿Olvidaste tu contraseña?</a>
            <a href="/registro">Crear una cuenta</a>
            </div>
        </form>
    </body>
  );
};

export default LoginPage;
