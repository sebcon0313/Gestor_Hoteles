'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.createToken = function(hotel){
    var payload = {
        sub: hotel._id,
        nombre: hotel.nombre,
        user: hotel.user,
        password: hotel.password,
        gmail: hotel.gmail,
        precio: hotel.precio,
        calificacion: hotel.calificacion,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()

    };
    
    return jwt.encode(payload, secret);
};

exports.createToken = function (usuarioT){
    var payload = {
        sub: usuarioT._id,
        nombre: usuarioT.nombre,
        apellido: usuarioT.apellido,
        user: usuarioT.usuario,
        password: usuarioT.password,
        gmail: usuarioT.gmail,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix()
    };
    return jwt.encode(payload, secret);
};