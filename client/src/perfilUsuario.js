import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stylesheets/userProfile.css'; // Asegúrate de crear un archivo CSS para estilizar el componente
import TopBar from './Componentes/topBar';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    Nombre: '',
    Apellidos: '',
    Direccion: '',
    Correo: '',
    Productos: []
  });
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
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/usuario/auth/logout', {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div>
      <TopBar />
      <div className="user-profile">
        <h2>Perfil del Usuario</h2>
        <div className="user-info">
          <p><strong>Nombre:</strong> {userInfo.Nombre}</p>
          <p><strong>Apellidos:</strong> {userInfo.Apellidos}</p>
          <p><strong>Dirección:</strong> {userInfo.Direccion}</p>
          <p><strong>Correo:</strong> {userInfo.Correo}</p>
          <button onClick={() => { window.location.href = '/modificar-perfil'; }} className="modify-button">Modificar Perfil</button>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
        <h3>Productos en Venta</h3>
      </div>
    </div>
  );
};

export default UserProfile;

/*
<ul className="product-list">
          {userInfo.Productos.map(product => (
            <li key={product._id}>
              {product.Nombre} - {product.Precio} EUR
            </li>
          ))}
        </ul>
*/