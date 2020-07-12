'use strict'
 
var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Gestor_de_Hoteles', {useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => {
        console.log('la conexion se a realizado correctamente');

        //creacion de servidor
        app.listen(port, () => {
            console.log('servidor corriendo');
        });
    })
    .catch(err => console.log(err));