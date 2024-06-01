import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stylesheets/modProfile.css'; 
import TopBar from './Componentes/topBar';
import { useParams, useHistory } from 'react-router-dom';

const ModifyProduct = () => {
  const { productId } = useParams();
  const history = useHistory();
  const [productInfo, setProductInfo] = useState({
    Nombre: '',
    Descripcion: '',
    Precio: '',
    Imagen: ''
  });
  const [userRole, setUserRole] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
        try {
          const sessionResponse = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
          setUserRole(sessionResponse.data.Rol);
          if (sessionResponse.status !== 200) {
            history.push('/'); // Redirigir a la página principal si no está autenticado
          }
        } catch (error) {
          history.push('/'); // Redirigir a la página principal en caso de error
        }
      };
  
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/producto/${productId}`, { withCredentials: true });
        if (response.status === 200) {
          setProductInfo(response.data);
        }
      } catch (error) {
        console.error('Error al obtener la información del producto:', error);
      }
    };

    checkAuthentication();
    fetchProductInfo();
  }, [productId, history]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = productInfo.Imagen;

      if (newImage) {
        const formData = new FormData();
        formData.append('file', newImage);

        const uploadResponse = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        imagePath = `/images/${uploadResponse.data.filename}`;
      }

      const updatedProduct = {
        ...productInfo,
        Imagen: imagePath
      };

      await axios.put(`http://localhost:5000/api/producto/${productId}`, updatedProduct, { withCredentials: true });
      setMensaje('Producto actualizado exitosamente');
      
      if (userRole === 'admin') {
        history.push('/'); // Redirigir a la página principal para admin
      } else {
        history.push('/perfil'); // Redirigir al perfil del usuario
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setMensaje('Hubo un problema al actualizar el producto');
    }
  };

  return (
    <div>
      <TopBar />
      <div class="container">
        <div className="modify-profile">
          <h2>Modificar Producto</h2>
          <form onSubmit={handleSubmit} className="user-info">
            <div className="form-group">
              <label htmlFor="Nombre">Nombre del Producto</label>
              <input
                type="text"
                id="Nombre"
                name="Nombre"
                value={productInfo.Nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Descripcion">Descripción</label>
              <textarea
                id="Descripcion"
                name="Descripcion"
                value={productInfo.Descripcion}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="Precio">Precio</label>
              <input
                type="number"
                id="Precio"
                name="Precio"
                value={productInfo.Precio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Imagen">Imagen</label>
              <input
                type="file"
                id="Imagen"
                name="Imagen"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="modify-button2">Actualizar Producto</button>
          </form>
          <br></br>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;
