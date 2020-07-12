'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = Schema ({
    nombre: String,
    user: String,
    password: String,
    gmail: String,
    precio: String,
    calificacion: String

});

module.exports = mongoose.model('Hotel', HotelSchema);