import React, { useState, useEffect } from 'react';
import './Stylesheets/product.css';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import TopBar from './Componentes/topBar';
import Footer from './Componentes/footer';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/producto/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      }
    };

    fetchProduct();
    checkSession();
  }, [id]);

  const handleBuy = () => {
    history.push(`/pasarela/${id}`);
  };

  const handleFavourite = async (productId) => {
    try {
      console.log('Añadiendo a favoritos:', productId);
      const response = await axios.post('http://localhost:5000/api/producto/favourites', {
        productId
      }, { withCredentials: true });
      console.log(response.data);
      history.push('/favoritos');
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/producto/${productId}`, { withCredentials: true });
      console.log(response.data);
      history.push('/');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleEditProduct = (productId) => {
    history.push(`/modificar-producto/${productId}`);
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <TopBar />
      <div className="product-page">
        <div className="product-card">
          <img src={product.Imagen} alt={product.Nombre} className="product-image" />
          <div className="product-infop">
            <h2 className='tit'>{product.Nombre}</h2>
            <span className="product-price">{product.Precio} €</span>
            <p className="product-description">{product.Descripcion}</p>
            <div className="product-actions">
              {user && user.Rol === 'admin' ? (
                <>
                  <button className="btn-edit" onClick={() => handleEditProduct(product._id)}>Modificar</button>
                  <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
                </>
              ) : (
                <>
                  <button className="btn-favorite" onClick={() => handleFavourite(product._id)}>❤ Añadir a Favoritos</button>
                  <button className="btn-buy" onClick={handleBuy}>Comprar</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
