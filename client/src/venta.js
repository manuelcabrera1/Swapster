import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Stylesheets/saleDetails.css'; // Crear este archivo CSS para los estilos
import TopBar from './Componentes/topBar';
import Footer from './Componentes/footer';

const SaleDetails = () => {
  const { idProducto } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);

  useEffect(() => {
    const fetchProductAndBuyerInfo = async () => {
      try {
        // Obtener la información del producto
        const productResponse = await axios.get(`http://localhost:5000/api/producto/${idProducto}`, { withCredentials: true });
        const product = productResponse.data;
        console.log('Información del producto:', product);
        setProductInfo(product);

        // Obtener la información del comprador
        if (product.IdComprador) {
          const buyerResponse = await axios.get(`http://localhost:5000/api/usuario/${product.IdComprador._id}`, { withCredentials: true });
          setBuyerInfo(buyerResponse.data);
          console.log('Información del comprador:', buyerResponse.data);
        }
      } catch (error) {
        console.error('Error al obtener la información del producto y del comprador:', error);
      }
    };

    fetchProductAndBuyerInfo();
  }, [idProducto]);

  if (!productInfo || !buyerInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <TopBar />
      <div className="sale-details">
        <h2>Detalles de la Venta</h2>
        <div className="product-info">
          <h3>Producto Vendido</h3>
          <img src={productInfo.Imagen} alt={productInfo.Nombre} className="product-image" />
          <p><strong>Nombre:</strong> {productInfo.Nombre}</p>
          <p><strong>Descripción:</strong> {productInfo.Descripcion}</p>
          <p><strong>Precio:</strong> {productInfo.Precio} EUR</p>
        </div>
        <div className="buyer-info">
          <h3>Información del Comprador</h3>
          <p><strong>Nombre:</strong> {buyerInfo.Nombre}</p>
          <p><strong>Apellidos:</strong> {buyerInfo.Apellidos}</p>
          <p><strong>Correo:</strong> {buyerInfo.Correo}</p>
          <p><strong>Dirección:</strong> {buyerInfo.Direccion}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SaleDetails;
