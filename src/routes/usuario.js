'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router();
var md_aut = require('../middlewares/autenticacion');  

api.post('/GUARDAR_USER', UsuarioController.ReguistrarUser);
api.post('/LOGUIN_USER', UsuarioController.Login_User);
api.put('/EDITAR_USER/:id', md_aut.ensureAusth, UsuarioController.EditarUser);
api.delete('/ELIMINAR_USER/:id', md_aut.ensureAusth, UsuarioController.EliminarUser);

module.exports = api;