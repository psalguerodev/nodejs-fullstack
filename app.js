//Componentes requeridos
const express = require('express');
const mongoose= require('mongoose')

//Globals
const PORT    = 9091;
const URL_MDB = 'mongodb://127.0.0.1:27017/hospitalDB'

//Inicializar variables
const app    = express();


//Conexion de la BD Mongo DB
mongoose.connect(URL_MDB , err => {
    if( !err ) console.log('Conectado a MongoDB correctamente!')
    if( err ) throw err
})


//Rutass
app.get("/", (request,response, nextFunct ) => {
    response.status(200).json({
        ok: true,
        message:'Petición realizada correctamente.'
    });
})

//Configuracion del Servidor
app.listen(PORT, () => {
    console.log('Servidor online!!')
    console.log('PORT :: \x1b[43m%s\x1b[0m' , PORT );
})