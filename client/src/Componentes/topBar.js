import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Stylesheets/topBar.css'; 
import logo from '../images/logo5.png';

const TopBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      }
    };

    checkSession();
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
    <div className="top-bar">
      {/* Logo */}
      <div className="logo" onClick={() => { window.location.href = '/'; }}>
        <img src={logo} alt="Swapster Logo" className="nav-logo" />
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Buscar" />
      </div>

      {/* Botones de sesión o perfil según el rol */}
      <div className="session-buttons">
        {!user ? (
          <>
            <button className="session-button" onClick={() => { window.location.href = '/login'; }}>
              Inicia sesión
            </button>
            <button className="sell-button" onClick={() => { window.location.href = '/vender'; }}>
              + Vender
            </button>
          </>
        ) : user.Rol === 'user' ? (
          <>
            <button className="session-button" onClick={() => { window.location.href = '/perfil'; }}>
              Perfil
            </button>
            <button className="sell-button" onClick={() => { window.location.href = '/vender'; }}>
              + Vender
            </button>
          </>
        ) : user.Rol === 'admin' ? (
          <div className="admin-buttons">
            <button className="admin-button" onClick={() => { window.location.href = '/'; }}>
              Productos
            </button>
            <button className="admin-button" onClick={() => { window.location.href = '/usuarios'; }}>
              Usuarios
            </button>
            <button className="admin-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopBar;
