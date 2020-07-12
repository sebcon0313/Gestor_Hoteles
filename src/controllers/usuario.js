'use Strict'

var bcrypt = require('bcrypt-nodejs')


var User = require('../models/usuario');
var jwt = require('../servicios/jwt');

//=================================================================================================================================


//=================================================================================================================================
function ReguistrarUser (req, res){
    var params = req.body;
    var usuario = new User();
    
    if(params.nombre && params.apellido && params.user && params.password && params.gmail){

        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.user = params.user;
        usuario.password = params.password;
        usuario.gmail = params.gmail;

        // controlar usuario duplicados
        User.find ({ $or: [
            {gmail: usuario.gmail.toLowerCase()},
            {user: usuario.user.toLowerCase()}
        ]}).exec ((err, users) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(users && users.length >= 1) {
                return res.status(404).send({mensaje: 'Este usuario ya existe'})
            }else{
                //cifrar la contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    usuario.password = hash;

                    usuario.save ((err, userGurdado) => {
                        if(err) return res.status(500).send({mensaje: 'Error al guardar el usuario'});

                        if(userGurdado){
                            res.status(200).send({usuario: userGurdado});
                        }else{
                            res.status(404).send({mensaje: 'No se ha registrado el usuario'});
                        }
                    });
                });
            }
        });

    }else{
        return res.status(404).send({mensaje: 'Envia los datos necesarios'});
    }
}

// Login Usuario
function Login_User (req, res){
    var params = req.body;

    var gmail = params.gmail;
    var password = params.password;

    User.findOne({gmail: gmail}, (err, usuario) => {
        if(err) return res.status(500).send({mensaje: 'Error a la peticion'});

        if(usuario){
            bcrypt.compare(password, usuario.password, (err, check) => {
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({token: jwt.createToken(usuario)});
                    }else{
                        usuario.password = undefined;
                        return res.status(200).send({usuario});
                    }

                }else{
                    return res.status(404).send({mensaje: 'No se identifica el usuario'});
                }
            });
        }else{
            return res.status(404).send({mensaje: 'No se identifica el usuario!!'});
        }
    });
} 

// Editar Usuarios
function EditarUser (req, res){
    var userId = req.params.id;
    var Editar = req.body;

    // Eliminar contraseña
    delete Editar.password

    if(userId != req.usuarioT.sub){
        return res.status(500).send({mensaje: 'No tienes permiso para editar este usuario'});
    }

    User.findByIdAndUpdate(userId, Editar, {new:true}, (err, userEditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

        if(!userEditado) return res.status(404).send({mensaje: 'No se pudo editar el usuario'});

        return res.status(200).send({usuarioT: userEditado });
    });

}
// Eliminar Usuario
function EliminarUser (req, res){
    var userId = req.params.id;

    if(userId != req.usuarioT.sub){
        return res.status(500).send({mensaje: 'no tienes permiso para eliminar los datos del Usuario'});
    }

    User.findByIdAndDelete(userId,  (err, userBorrado) => {
        if(err) return res.status(500).send({mensaje: 'Erro a la peticion'});

        if(!userBorrado) return res.status(404).send({mensaje: 'no se ha podido eliminar el Usuario'});

        return res.status(200).send({mensaje: 'Su Usuario se ha Borrado Correctamente',usuarioT: userBorrado});
    });
}

module.exports = {
    ReguistrarUser,
    Login_User,
    EditarUser,
    EliminarUser,
}
