import React, { useState } from 'react';
import axios from 'axios';
//import './App.css'; 
import './Stylesheets/login.css';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/usuario/auth/login', {
        correo,contraseña}, { withCredentials: true});
      console.log(response.data);
      setMensaje('Inicio de sesión exitoso');
      history.push('/');
      // Aquí podrías redirigir al usuario o guardar el token de sesión, etc.
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Error al iniciar sesión, verifica tus credenciales');
    }
  };

  return (
    <div>
      <div class="background">
          <div class="shape"></div>
          <div class="shape"></div>
      </div>

      <form onSubmit={handleSubmit}>
          <h1>Iniciar Sesión</h1>
          
          <input id="correo" type="email" value={correo} placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} required/>
          <input id="contraseña" type={mostrarContraseña ? "text" : "password"} value={contraseña} placeholder="Contraseña" onChange={(e) => setContraseña(e.target.value)} required/>

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
              <button type="submit">Iniciar Sesión</button>
          </div>

          {mensaje && <p>{mensaje}</p>}

          <div className="links">
          <a href="/recordar-contraseña">¿Olvidaste tu contraseña?</a>
          <br />
          <a href="/registro">Crear una cuenta</a>
          </div>
      </form>
    </div>
  );
};

export default LoginPage;
