import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stylesheets/sellProduct.css';
import TopBar from './Componentes/topBar';
import { useHistory } from 'react-router-dom';

const SellProductPage = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (response.status !== 200) {
          history.push('/login'); 
        }
      } catch (error) {
        history.push('/login'); 
      }
    };

    checkSession();
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagen) {
      setMensaje('Por favor, selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imagen);

    try {
      // Subir la imagen al servidor del frontend
      const uploadResponse = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imagePath = `/images/${uploadResponse.data.filename}`;

      const productoData = {
        Nombre: nombre,
        Descripcion: descripcion,
        Precio: precio,
        Imagen: imagePath
      };

      // Enviar los datos del producto al backend
      await axios.post('http://localhost:5000/api/producto/create', productoData, { withCredentials: true });

      setMensaje('Producto puesto en venta exitosamente');
      history.push('/perfil');
    } catch (error) {
      console.error('Error al crear el producto:', error);
      setMensaje('Hubo un problema al crear el producto');
    }
  };

  return (
    <div>
      <TopBar />
      <div class="container">
        <div className="sell-product-page">
          <div className="sell-product-container">
            <h2>Vender un Articulo</h2>
            <form onSubmit={handleSubmit} className="sell-product-form">
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  value={nombre}
                  placeholder='Nombre'
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  placeholder='Descripción'
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  placeholder='Precio'
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  onChange={(e) => setImagen(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit">Vender Producto</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProductPage;
