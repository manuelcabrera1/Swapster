import React, { useState } from 'react';
import './App.css';  // Importar el archivo de estilos CSS

import MostrarUsuarios from './mostrarusuarios';
import CrearUsuario from './crearusuario';

const App = () => {
    const [mostrarCrearUsuario, setMostrarCrearUsuario] = useState(false);
    const [mostrarMostrarUsuarios, setMostrarMostrarUsuarios] = useState(false);

    const mostrarComponente = (componente) => {
        if (componente === 'crear') {
            setMostrarCrearUsuario(true);
            setMostrarMostrarUsuarios(false);
        } else if (componente === 'mostrar') {
            setMostrarCrearUsuario(false);
            setMostrarMostrarUsuarios(true);
        }
    };

    return (
        <div className="container">
            <h1 className="header">Swapster</h1>
            <div className="buttonContainer">
                <button className="button" onClick={() => mostrarComponente('crear')}>Crear Usuario</button>
                <button className="button" onClick={() => mostrarComponente('mostrar')}>Mostrar Usuarios</button>
            </div>
            {mostrarCrearUsuario && <CrearUsuario />}
            {mostrarMostrarUsuarios && <MostrarUsuarios />}
        </div>
    );
};

export default App;
