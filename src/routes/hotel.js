'use strict'

var express = require('express');
var HotelController = require('../controllers/hotel');

var api = express.Router();
var md_aute = require('../middlewares/autenticacion');

api.get('/RegistrarHotel',HotelController.RegistrarH);
api.post('/LOGIN', HotelController.Login);
api.put('/EDITAR/:id', md_aute.ensureAusth, HotelController.EditarUser);
api.delete('/ELIMINAR/:id', md_aute.ensureAusth, HotelController.EliminarH);
api.get('/BuscarHotelNombre', HotelController.BucarPorNombre)
api.get('/BuscarPorCalificacion', HotelController.BuscarPorCalificacion)
api.get('/BUscarPreciosMayMen', HotelController.BuscarPrecioMayMen)

module.exports = api;