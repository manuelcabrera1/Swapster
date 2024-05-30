import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom'; 
import './Stylesheets/userProfile.css'; 
import TopBar from './Componentes/topBar';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    Nombre: '',
    Apellidos: '',
    Direccion: '',
    Correo: '',
    Productos_vendidos: []
  });
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const sessionResponse = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (sessionResponse.status === 200) {
          const userId = sessionResponse.data._id.toString();
          const userResponse = await axios.get(`http://localhost:5000/api/usuario/${userId}`, { withCredentials: true });
          setUserInfo(userResponse.data);
          console.log('Información del usuario:', userResponse.data);
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        history.push('/');
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

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/producto/${productId}`, { withCredentials: true });
      setUserInfo({
        ...userInfo,
        Productos_vendidos: userInfo.Productos_vendidos.filter(product => product._id !== productId)
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
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
        <hr />
        <br />
        <h3>Productos en Venta</h3>
        <ul className="product-list">
          {userInfo.Productos_vendidos.map(product => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>
                {product.Nombre} - {product.Precio} EUR
              </Link>
              <div className="product-buttons">
                <button 
                  className="modify-product-button"
                  onClick={() => history.push(`/modificar-producto/${product._id}`)}
                >
                  Modificar
                </button>
                <button 
                  className="delete-product-button"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
