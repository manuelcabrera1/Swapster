import React, { useState, useEffect } from 'react';
import './Stylesheets/home.css';
import TopBar from './Componentes/topBar';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useHistory } from 'react-router-dom'; 


const HomePage = () => {
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/producto'); 
        setProducts(response.data); 
        console.log('Productos:', response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts(); 
  }, []); 

  const goToProductPage = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <div className="home-page">
      <TopBar />
      <div className="product-list">
        {products.map(product => (
          <div onClick={() => goToProductPage(product._id)} key={product._id} className="product-card">
              <img src={product.Imagen} alt={product.Nombre} className="product-image"/>
              <div className="product-info">
                <h3 className="product-name">{product.Nombre}</h3>
                <p className="product-price">{product.Precio} EUR</p>
              </div>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default HomePage;
