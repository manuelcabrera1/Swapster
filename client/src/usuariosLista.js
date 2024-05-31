import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import TopBar from './Componentes/topBar';
import Footer from './Componentes/footer';
import './Stylesheets/adminUserList.css'; // Crear este archivo CSS para los estilos

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuario', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/usuario/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== userId));
      setMensaje('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setMensaje('Hubo un problema al eliminar el usuario');
    }
  };

  const handleEditUser = (userId) => {
    history.push(`/modificar-perfil/${userId}`);
  };

  return (
    <div className="page-container">
      <TopBar />
      <div className="content-wrap">
        <div className="admin-user-list">
          <h2>Lista de Usuarios</h2>
          {mensaje && <p>{mensaje}</p>}
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.Nombre}</td>
                  <td>{user.Apellidos}</td>
                  <td>{user.Correo}</td>
                  <td>
                    <button onClick={() => handleEditUser(user._id)}>Modificar</button>
                    <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminUserList;
