import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import TopBar from './Componentes/topBar';
import './Stylesheets/pasarela.css';

const stripePromise = loadStripe('pk_test_51PMDKiFpIMUqqwLpja1MeVP4obORZwGmL5gp012Y0k2GOBHlXCsiN9zlEMPQZgMKl1vvBapocSTGF2SsOBxSHZjl00uc2dT4Q2');

const CheckoutForm = ({ product }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post("http://localhost:5000/api/payment/checkout", {
          id,
          idProducto: product._id,
          amount: product.Precio * 100,
        });

        console.log(data);

        if (data.paymentIntent && data.paymentIntent.status === 'succeeded') {
          setMessage('Pago exitoso');
          elements.getElement(CardElement).clear();
          history.push('/success');  // Redirigir a la página de éxito
        }
      } catch (error) {
        console.error(error);
        setMessage('Hubo un problema al procesar tu pago.');
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="product-card">
        <div className="product-info">
          <h2>{product.Nombre}</h2>
          <span className="product-price">{product.Precio} €</span>
          <p className="product-description">{product.Descripcion}</p>
        </div>
      </div>
      <CardElement className="card-element" />
      <button disabled={!stripe || isProcessing}>
        {isProcessing ? 'Procesando...' : 'Pagar'}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

const Pasarela = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/producto/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <TopBar />
      <div className="pasarela-page">
        <div className="checkout-form-container">
          <Elements stripe={stripePromise}>
            <CheckoutForm product={product} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Pasarela;
