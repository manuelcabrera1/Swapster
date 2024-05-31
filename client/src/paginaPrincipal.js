import React, { useState, useEffect } from 'react';
import './Stylesheets/home.css';
import TopBar from './Componentes/topBar';
import Footer from './Componentes/footer';
import axios from 'axios';

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
    <div className="home-pageh">
      <TopBar />
      <div className="content">
        <div className="product-listh">
          {products.map(product => (
            <div
              onClick={() => goToProductPage(product._id)}
              key={product._id}
              className="product-cardh"
            >
              <img src={product.Imagen} alt={product.Nombre} className="product-imageh" />
              <div className="product-infoh">
                <h3 className="product-nameh">{product.Nombre}</h3>
                <p className="product-priceh">{product.Precio} EUR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
