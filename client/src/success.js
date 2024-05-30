import React from 'react';
import { useHistory } from 'react-router-dom';
import './Stylesheets/success.css'; // Asegúrate de crear y enlazar tu archivo CSS
import logo from './images/logo5.png';

const Success = () => {
    const history = useHistory();

    const handleGoHome = () => {
        history.push('/');
    };

    return (
        <div className="success-page">
            <h1>Pago exitoso</h1>
            <p>Gracias por su compra!</p>
            <button onClick={handleGoHome} className="go-home-button">Volver a la página principal</button>
            <img src={logo} alt="logo" className="logo" />
        </div>
    );
};

export default Success;
