'use strict'

var bcrypt = require('bcrypt-nodejs');

var Hotel = require('../models/hotel');
var jwt = require('../servicios/jwt');

// Registrar
function RegistrarH(req, res){
    var params = req.body;
    var hotel = new Hotel();

    if(params.nombre && params.user && params.password && params.gmail 
        && params.precio && params.calificacion ){

        hotel.nombre = params.nombre,
        hotel.user = params.user,
        hotel.password = params.password,
        hotel.gmail = params.gmail,
        hotel.precio = params.precio,
        hotel.calificacion = params.calificacion

        // Controlar usuarios duplicados
        Hotel.find({ $or: [
            {gmail: hotel.gmail.toLowerCase()},
            {user: hotel.user.toLowerCase()}
        ]}).exec((err, user) => {
            if(err) return res.status(404).send({mensaje: 'Error en la peticion de Usuario'});

            if(user && user.length >= 1){
                return res.status(200).send({mensaje: 'Este usuario ya existe'});
            }else{
                // Cifrar la contraseña y Guardar datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    hotel.password = hash;

                    hotel.save((err, userStored) => {
                        if(err) return res.status(500).send({mensaje: 'Error al guardar el usuario'});

                        if(userStored){ 
                            res.status(200).send({user: userStored});
                        }else{
                            return res.status(404).send({mensaje: 'No se ha registrado el usuario'});
                        }
                    });
                });
                
            }

        });
    }else{
        return res.status(200).send({mensaje: 'Envia todos los campos necesarios!!'});
    }

}

// Login
function Login(req,res){
    var params = req.body;

    var gmail = params.gmail;
    var password = params.password;

    Hotel.findOne({gmail: gmail},(err, user) => {
        if(err) return res.status(500).send({mensaje:'error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password, (err, check) => {

                if(check){
                    if(params.gettoken){
                        return res.status(200).send({token: jwt.createToken(user)});
                    }else{
                        user.password = undefined;                  
                        return res.status(200).send({mensaje:'BIENVENIDO USUARIO', user});
                    }
                }else{
                    return res.status(404).send({mensaje: 'No se identifica el usuario'});
                }
            });
        }else{
            return res.status(404).send({mensaje: 'No se identifica el usuario !!'});
        }

    });
}

// Editar Usuario
function EditarUser(req, res){
    var userId = req.params.id;
    var editar = req.body;

    // borrar la propiedad password
    delete editar.password;

    if(userId != req.hotel.sub){
        return res.status(500).send({mensaje: 'no tines permiso para actualizar los datos del usuario'});
    }

    Hotel.findByIdAndUpdate(userId, editar, {new:true}, (err, userEditado) => {
        if(err) return res.status(500).send({mensaje: 'Error a la peticion'});

        if(!userEditado) return res.status(404).send({mensaje: 'No se ha podido editar el usuario'});

        return res.status(200).send({hotel: userEditado});
    });
}

// Eliminar Hotel
function EliminarH (req, res){
    var userId = req.params.id;

    if(userId != req.hotel.sub){
        return res.status(500).send({mensaje: 'no tienes permiso para eliminar los datos del hotel'});
    }

    Hotel.findByIdAndDelete(userId,  (err, userBorrado) => {
        if(err) return res.status(500).send({mensaje: 'Erro a la peticion'});

        if(!userBorrado) return res.status(404).send({mensaje: 'no se ha podido eliminar el hotel '});

        return res.status(200).send({hotel: userBorrado});
    });
}

function BucarPorNombre(req, res) {
    var name = req.params.name

    Hotel.find({ nombre: { $regex: name } }, (error, hotelName) => {
        if (error) return res.status(500).send({ mensaje: 'Error en la petición' })
        if (!hotelName) return res.status(404).send({ mensaje: 'No hay ningun usuario con ese nombre' })
        return res.status(200).send({ mensaje: 'Orden Alfabetico', hotel: nombre })
    }).sort({ nombre: 1 })
}

function BuscarPorCalificacion(req, res) {
    Hotel.find((error, hoteles) => {
        if (error) return res.status(500).send({ mensaje: 'Error en la petición' })
        if (!hoteles) return res.status(404).send({ mensaje: 'Error al mostrar las calificaones de los hoteles' })
        return res.status(200).send({ mensaje: 'Usuarios con mejor puntuaje:', hoteles })
    }).sort({ calificacion: -1 })
}

function BuscarPrecioMayMen(req, res) {
    Hotel.find((err,precios) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!precios) return res.status(404).send({mensaje: 'Eror al mostrar los precios de hoteles May a Men'})
        return res.status(200).send({mensaje:'Hoteles con los Precios mas elevados', precios})
    }).sort({precio: -1})
    
}


module.exports = {
    RegistrarH,
    Login,
    EditarUser,
    EliminarH,
    BucarPorNombre,
    BuscarPorCalificacion,
    BuscarPrecioMayMen
}