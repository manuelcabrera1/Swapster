// src/Componentes/Footer.js
import React from 'react';
import '../Stylesheets/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h4>Sobre Nosotros</h4>
          <p>Somos una empresa dedicada a proporcionar la mejor experiencia de compra y venta en línea. Nuestra misión es conectar compradores y vendedores de manera segura y eficiente.</p>
        </div>
        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>Email: swapster@swapster.com</p>
          <p>Teléfono: +123 456 7890</p>
          <p>Dirección: Aulario Averroes, Aula B6, Rabanales</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
