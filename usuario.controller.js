const UsuarioCtrl = {};
const Usuario = require('../models/Usuario');
const rolesPermitidos = require('../middleware/roles');


// Crear una cuenta nueva //REVISAR
UsuarioCtrl.crearCuenta = async (req, res) => {
    try {
        const { Nombre, Apellidos, Direccion, Correo, Password} = req.body;

        //comprobamos que el usuario no exista
        const usuarioExistente = await Usuario.findOne({Correo});
        if (usuarioExistente) {
             return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        //si no existe lo creamos
        const newUser = new Usuario({ Nombre, Apellidos, Direccion, Correo, Rol:'user', Password});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
       // console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el usuario' });
    }
};

UsuarioCtrl.getUserById = async (req, res) => {
    try {
        const usuarioId = req.params.userId;

        // Usar populate para cargar los productos vendidos
        const usuario = await Usuario.findById(usuarioId).populate('Productos_vendidos');

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//REVISARRRRRRRRRRR
UsuarioCtrl.login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        var result = await Usuario.findOne({ Correo: correo });

        if (result) {
            if (result.Password != contraseña) {
                res.status(400).json({ message: 'Contraseña incorrecta' });
            }
            req.session.idUsuario = result._id.toString();
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ message: 'Usuario no encontrado' });
        }

    } catch (error) {
        console.error('Error al iniciar sesion', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

UsuarioCtrl.logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Sesión cerrada exitosamente' });
    });
  };

UsuarioCtrl.getSessionData = async (req, res) => {
    try
    {
        if (req.session && req.session.idUsuario) {
            const usuario = await Usuario.findById(req.session.idUsuario);
            usuario.Password = 0;
            if (!usuario)
            {
                res.status(401).json({ message: 'No autenticado' });

            }
            res.status(200).json(usuario);
        } else {
            res.status(401).json({ message: 'No autenticado' });
        }
    } catch(error) {
        res.status(501).json({message:error});

    }
    
  };

UsuarioCtrl.modificarPerfil = async (req, res) => {
    try
    {
        if (req.session && req.session.idUsuario) {
            const { Nombre, Apellidos, Direccion, Correo} = req.body;
            const usuario = await Usuario.findByIdAndUpdate(req.session.idUsuario, { Nombre, Apellidos, Direccion, Correo},{ new: true});
            if (!usuario)
            {
                res.status(401).json({ message: 'No autenticado' });

            }

            res.status(200).json({ message: 'Usuario modificado correctamente' });
        } else {
            res.status(401).json({ message: 'No autenticado' });
        }
    } catch(error) {
        res.status(501).json({message:error});

    }
    
};
  
module.exports = UsuarioCtrl;
