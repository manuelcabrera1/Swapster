import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './Componentes/topBar'; 
import './App.css'; 

const MostrarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/usuarios');
                setUsuarios(response.data.usuarios); // Actualiza el estado con la lista de usuarios
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/usuarios/${userId}`);
            // Actualizar la lista de usuarios después de eliminar
            const updatedUsuarios = usuarios.filter((usuario) => usuario._id !== userId);
            setUsuarios(updatedUsuarios);
            console.log('Usuario eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    return (
        <>
            <NavBar userLoggedIn={userLoggedIn} />
            <div className="usuarios-container">
                <h1>Usuarios</h1>
                {usuarios.length > 0 ? (
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario._id}>
                                    <td>{usuario.Nombre}</td>
                                    <td>{usuario.Correo}</td>
                                    <td>
                                        <button onClick={() => handleDelete(usuario._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No se encontraron usuarios</p>
                )}
            </div>
        </>
    );
};

export default MostrarUsuarios;

/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importar tu archivo CSS personalizado

const MostrarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/usuarios');
                setUsuarios(response.data.usuarios); // Actualiza el estado con la lista de usuarios
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/usuarios/${userId}`);
            // Actualizar la lista de usuarios después de eliminar
            const updatedUsuarios = usuarios.filter((usuario) => usuario._id !== userId);
            setUsuarios(updatedUsuarios);
            console.log('Usuario eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    return (
        <div className="usuarios-container">
            <h1>Usuarios</h1>
            {usuarios.length > 0 ? (
                <table className="usuarios-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario._id}>
                                <td>{usuario.Nombre}</td>
                                <td>{usuario.Correo}</td>
                                <td>
                                    <button onClick={() => handleDelete(usuario._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron usuarios</p>
            )}
        </div>
    );
};

export default MostrarUsuarios;
*/



