const express = require('express');
const router = express.Router();
const Stripe = require('stripe')
const Producto = require('../models/Producto')
const Usuario = require('../models/Usuario')
const {comprobarAutenticacion, rolesPermitidos} = require('../middleware/roles');


//const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc');


router.post('/checkout', comprobarAutenticacion, async (req, res) => {
  const { id, idProducto, amount} = req.body;


  try {

    //comprobamos que recibimos el id de la transaccion, en caso contrario no podremos realizar el pago
    if (!id)
        return res.status(500).json({error: 'Error al procesar el pago'});

    /*comprobamos que el producto este en la bd, 
    ademas esto nos permitira rescatar informacion del producto para guardar en la info
    de pago de stripe*/
    const producto = await Producto.findById(idProducto);

    if (!producto)
        return res.status(404).json('Producto no encontrado');

  // Verificar si el producto lo puso en venta el usuario
    const productoVendido = await Usuario.findOne({ _id: req.session.idUsuario, Productos_vendidos: producto._id });
    
    if (productoVendido) {
        return res.status(401).json({ message: 'No puedes comprar Productos puestos a la venta por ti' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "EUR",
        description: producto.Descripcion,
        payment_method: id,
        confirm: true, //confirma el pago inmediatamente
        return_url: 'https://localhost:3000/success' // Reemplaza con tu URL real
      });

    //si se ha procesado el pago correctamente entonces es estableceremos el producto a vendido
   
    const updatedProduct= await Producto.findByIdAndUpdate(idProducto, {IdComprador: req.session.idUsuario}, {new:true});
    if (!updatedProduct)
        return res.status(401).json('Error al actualizar el produco');
    
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


