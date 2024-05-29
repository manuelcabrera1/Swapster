import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Stylesheets/topBar.css'; 
import logo from '../images/logo5.png';

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

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

      {/* Session/Login or Profile Button */}
      <div className="session-button">
        {isLoggedIn ? (
          <button onClick={() => { window.location.href = '/perfil'; }}>
            Perfil
          </button>
        ) : (
          <button onClick={() => { window.location.href = '/login'; }}>
            Regístrate o inicia sesión
          </button>
        )}
      </div>

      {/* Sell Button */}
      <div className="sell-button">
        <button onClick={() => { window.location.href = '/vender'; }}>
          + Vender
        </button>
      </div>
    </div>
  );
};

export default TopBar;
