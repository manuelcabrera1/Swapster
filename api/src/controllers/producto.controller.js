const productoCtrl = {};
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario')

productoCtrl.getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Vender un producto
productoCtrl.venderProducto = async (req, res) => {
    try {
        if (req.session && req.session.idUsuario) {
            const { Nombre, Descripcion, Precio, Imagen } = req.body;

            //comprobamos que el proucto no exista
            const productoExistente = await Usuario.findOne({Nombre,Descripcion,Precio,Imagen});
            if (productoExistente) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            }

            // Crear el producto en caso de que no exista
            const newProducto = new Producto({ Nombre, Descripcion, Precio, Imagen });
            const savedProducto = await newProducto.save();
            console.log('Producto guardado:', savedProducto);

            // Añadir el producto a la lista de productos vendidos del usuario
            const usuarioActualizado = await Usuario.findByIdAndUpdate(
                req.session.idUsuario,
                { $push: { Productos_vendidos: savedProducto._id } }, // Asegúrate de que el campo coincide con el esquema
                { new: true }
            );

            if (!usuarioActualizado) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            console.log('Usuario actualizado:', usuarioActualizado);

            return res.status(201).json({ producto: savedProducto });
        } else {
            return res.status(401).json({ message: 'Error al vender el producto' });
        }
    } catch (error) {
        console.error('Error al vender el producto:', error);
        return res.status(500).json({ error: 'Hubo un problema al crear el producto' });
    }
};



// Obtener un producto por su _id
productoCtrl.getProductById =  async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Producto.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Actualizar un producto por su ID (_id)

productoCtrl.updateProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProducto = await Producto.findByIdAndUpdate(productId, req.body, { new: true });

        if (!updatedProducto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProducto);
    } catch (error) {
        console.error('Error al actualizar el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Eliminar un producto por su _id
productoCtrl.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Producto.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto por ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = productoCtrl;