import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stylesheets/modProfile.css'; 
import TopBar from './Componentes/topBar';
import { useHistory } from 'react-router-dom';


const ModifyProfile = () => {
  const [userInfo, setUserInfo] = useState({
    Nombre: '',
    Apellidos: '',
    Direccion: '',
    Correo: '',
  });
  const history = useHistory();
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const sessionResponse = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (sessionResponse.status === 200) {
          const userId = sessionResponse.data._id.toString();
          const userResponse = await axios.get(`http://localhost:5000/api/usuario/${userId}`, { withCredentials: true });
          setUserInfo(userResponse.data);
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        history.push('/');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/usuario', userInfo, { withCredentials: true });
      setMensaje('Información actualizada exitosamente');
      history.push('/perfil');
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      setMensaje('Hubo un problema al actualizar la información');
    }
  };

  return (
    <div>
      <TopBar />
      <div className="modify-profile">
        <h2>Modificar Perfil</h2>
        <form onSubmit={handleSubmit} className="user-info">
          <div className="form-group">
            <label htmlFor="Nombre">Nombre</label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={userInfo.Nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Apellidos">Apellidos</label>
            <input
              type="text"
              id="Apellidos"
              name="Apellidos"
              value={userInfo.Apellidos}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Direccion">Dirección</label>
            <input
              type="text"
              id="Direccion"
              name="Direccion"
              value={userInfo.Direccion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Correo">Correo</label>
            <input
              type="email"
              id="Correo"
              name="Correo"
              value={userInfo.Correo}
              onChange={handleInputChange}
              required
            />
          </div>
          <br></br>
          <button type="submit" className="modify-button">Actualizar Información</button>
        </form>
        <br></br>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default ModifyProfile;
