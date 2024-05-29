const UsuarioCtrl = {};
const Usuario = require('../models/Usuario');
const rolesPermitidos = require('../middleware/roles');


// Crear una cuenta nueva
UsuarioCtrl.crearCuenta = async (req, res) => {
    try {
        const { Nombre, Apellidos, Direccion, Correo, Password, Rol, Productos_vendidos, Productos_comprados} = req.body;
        const newUser = new Usuario({ Nombre, Apellidos, Direccion, Correo, Rol, Password, Productos_vendidos: Productos_vendidos || [], Productos_comprados: Productos_comprados});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el usuario' });
    }
};

UsuarioCtrl.getUserById = async (req, res) => {
    try
    {
        const usuarioId = req.params.userId;
        const usuario = await Usuario.findById(usuarioId);
        
        if (!usuario)
            res.status(400).json("Usuario no encontrado");

        res.json(usuario);

    } catch(error) {
        res.status(501).json({error: 'Acceso no autorizado'});
    }
  
}


UsuarioCtrl.login = async (req, res) => {
    try {
        const {correo, contraseña} = req.body;

        var result=await Usuario.findOne({Correo: correo});

        if (result)
        {
            if (result.Password!=contraseña)
            {
                res.status(400).json("Contraseña incorrecta");
            }
            req.session.idUsuario = result._id.toString();
            res.status(200).json("Inicio de sesión exitoso")    
        }
        else 
            res.status(400).json("Usuario no encontrado")

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

UsuarioCtrl.getSession = async (req, res) => {
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

module.exports = UsuarioCtrl;
