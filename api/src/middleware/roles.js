const Usuario = require('../models/Usuario')

const comprobarAutenticacion = async (req, res, next) => {
    if (req.session && req.session.idUsuario) {
        console.log("Una locura este id", req.session.idUsuario);
      try {
        const usuario = await Usuario.findById(req.session.idUsuario);
        if (!usuario) {
            return res.status(401).json({ message: 'Acceso no autorizado' });
        }
        usuario.Password = 0;
        req.usuario = usuario; // Adjunta el usuario verificado al objeto req
        next();
      } catch (error) {
        return res.status(500).json({error: 'Acceso no autorizado'});
      }
    } else {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
}
  

const rolesPermitidos = function(rol)   {
    return (req, res, next)=>{
        if (req.session && req.session.idUsuario && req.usuario.Rol == rol){
            next();
        } else {         
            res.status(401).json({error: 'No autorizado'});
        }
    }
}

module.exports = {comprobarAutenticacion, rolesPermitidos};