/*import React from 'react';
import logo from '../images/logo2.png';
import React, { useState } from 'react';
import axios from 'axios';

const NavBar = ({ userLoggedIn }) => {
  return (
    <div className="nav-container">
      <img src={logo} alt="Swapster Logo" className="nav-logo" />
      <input type="search" placeholder="Buscar..." className="nav-search"/>
      <button className="nav-button">
        {userLoggedIn ? 'Perfil' : 'Iniciar Sesión'}
      </button>
    </div>
  );
};

export default NavBar;*/

import React from 'react';
import { useState } from 'react';
import '../Stylesheets/topBar.css'; 
import logo from '../images/logo5.png';

const TopBar = ({ user }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  return (
    <div className="top-bar">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Swapster Logo" className="nav-logo" />
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Buscar" />
      </div>

      {/* Session/Login or Profile Button */}
      <div className="session-button">
        {isLoggedIn ? (
          <button onClick={() => {window.location.href = '/perfil';}}>
            Perfil
          </button>
        ) : (
          <button onClick={() => {window.location.href = '/login';}}>
            Regístrate o inicia sesión
          </button>
        )}
      </div>

      {/* Sell Button */}
      <div className="sell-button">
        <button onClick={() => {window.location.href = '/vender';}}>
          + Vender
        </button>
      </div>
    </div>
  );
};

export default TopBar;

