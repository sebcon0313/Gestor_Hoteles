'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var hotel_routes = require('./routes/hotel');
var user_routes = require('./routes/usuario');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//rutas
app.use('/api', hotel_routes);
app.use('/api', user_routes);

//export
module.exports = app; 


