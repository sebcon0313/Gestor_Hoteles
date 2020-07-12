'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.ensureAusth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        
        // si lleva una fecha que es menor a la de ahora
        if(payload.exp <= moment().unix()){
            return sed.status(401).send({
                message: 'el mensaje ha expiraba'
            });
        }
    }catch(ex){
        return res.status(404).send({
           menssage: 'El token no es valido'
        });
    }
    
    req.hotel = payload;
    req.usuarioT = payload;
    next();
}