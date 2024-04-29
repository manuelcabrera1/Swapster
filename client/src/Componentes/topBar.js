import React from 'react';
import logo from '../images/logo2.png'; // Asegúrate de poner el logo en la misma carpeta que este archivo o ajusta la ruta

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

export default NavBar;
