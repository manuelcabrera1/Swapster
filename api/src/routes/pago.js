const express = require('express');
const router = express.Router();
const Stripe = require('stripe')
const Producto = require('../models/Producto')
const Usuario = require('../models/Usuario')


const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

router.post('/checkout', async (req, res) => {
  const { id, idProducto, amount} = req.body;
  console.log("La sesion ahora va de locos", req.session.idUsuario);

  try {

    const producto = await Producto.findById(idProducto);
    console.log(producto);

    if (!producto)
        return res.status(401).json('Error al procesar el pago');

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "EUR",
        description: producto.Descripcion,
        payment_method: id,
        confirm: true, //confirm the payment at the same time
        return_url: 'https://localhost:3000/success' // Reemplaza con tu URL real
      });

    //si se ha procesado el pago correctamente entonces es estableceremos el producto a vendido
   
    const updatedProduct= await Producto.findByIdAndUpdate(idProducto, {Vendido:true}, {new:true});
    if (!updatedProduct)
        return res.status(401).json('Error al actualizar el produco');
    console.log(req.session);
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.session.idUsuario,
        { $push: { Productos_comprados: producto._id } }, 
        { new: true }
    );

    if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(paymentIntent);
    res.status(200).send({ message:'Pago exitoso' , paymentIntent });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: error.raw.message });
  }
});

module.exports = router;


