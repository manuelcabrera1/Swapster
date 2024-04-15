import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Realiza una solicitud al backend para obtener los usuarios
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Usuarios</h1>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <strong>Nombre:</strong> {user.Nombre} {user.Apellidos}<br />
              <strong>Dirección:</strong> {user.Direccion}<br />
              <strong>Correo:</strong> {user.Correo}<br />
              <strong>Tipo:</strong> {user.Tipo}<br />
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
