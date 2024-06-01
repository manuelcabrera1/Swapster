import React, { useState, useEffect } from 'react';
import './Stylesheets/home.css';
import TopBar from './Componentes/topBar';
import Footer from './Componentes/footer';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; 
import { set } from 'mongoose';

const Favorites = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({
    Favoritos: []
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const sessionResponse = await axios.get('http://localhost:5000/api/usuario/auth/session', { withCredentials: true });
        setUserInfo(sessionResponse.data);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        history.push('/');
      }
    };
    fetchUserInfo();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/producto/deletefavourites', {
        productId
      }, { withCredentials: true });
      console.log('Eliminado de favoritos:', response.data);
      setUserInfo(prevState => ({
        ...prevState,
        Favoritos: prevState.Favoritos.filter(product => product._id !== productId)
      }));
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  };

  const goToProductPage = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <div className="home-pageh">
      <TopBar />
      <br />
        <h1>Favoritos</h1>
        <hr />
      <br />
      <div className="product-listh">
        {userInfo.Favoritos.map(product => (
          <div key={product._id} className="product-cardh">
            <img
              src={product.Imagen}
              alt={product.Nombre}
              className="product-imageh"
              onClick={() => goToProductPage(product._id)}
            />
            <div className="product-infoh">
              <h3 className="product-nameh">{product.Nombre}</h3>
              <p className="product-priceh">{product.Precio} EUR</p>
              <button className="remove-favorite-button" onClick={() => handleRemoveFavorite(product._id)}>
                Eliminar de Favoritos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
