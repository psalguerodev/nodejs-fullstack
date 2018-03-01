// ==========================================
// Name  : app.js
// Author: Patrick Salguero
// Date  : Sab 10 de Feb - 2018
// Descr : Configuracion del Servidor Inicial
// ==========================================

//Componentes requeridos
const express = require('express')
const mongoose= require('mongoose')
const bodyParser = require('body-parser')
const configuration = require('./config/configuration')

//Globals
const PORT    = configuration.SYS_PORT
const URL_MDB = configuration.CON_STRING_MLAB

//Rutas por roles
const app_routes = require('./routes/app.routes')
const user_routes = require('./routes/user.routes')
const login_routes = require('./routes/login.routes')
const doctor_routes = require('./routes/doctor.routes')
const hospital_routes = require('./routes/hospital.routes')
const seeker_routes = require('./routes/seeker.routes')
const upload_routes = require('./routes/upload.routes')
const image_routes = require('./routes/image.routes')
const google_routes = require('./routes/google-signin.routes')


//Inicializar variables
const app    = express()

//	Middleware - CORS de la Api Restfull
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods" , "POST, GET, PUT, DELETE, OPTIONS")
    next()
})

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use( bodyParser.json() )

//Conexion de la BD Mongo DB
mongoose.connect(URL_MDB , err => {
    if( !err ) console.log('Conectado a MongoDB correctamente!')
    if( err ) throw err
})

// Mostrar imagene del servidor /uploads Servidor de archivos
// const serverIndex = require('serve-index')
// app.use( express.static(__dirname + '/') )
// app.use( '/uploads' , serverIndex( __dirname + '/uploads' ) )

//Rutas de la Aplicaccion
app.use( '/user' ,user_routes )
app.use( '/login' , login_routes )
app.use( '/login' , google_routes )
app.use( '/hospital' , hospital_routes )
app.use( '/doctor', doctor_routes )
app.use( '/seeker', seeker_routes )
app.use( '/upload' , upload_routes )
app.use( '/image' , image_routes )
app.use( '/', app_routes )


//Configuracion del Servidor
try{
    app.listen(PORT, () => {
        console.log('Servidor online!!')
        console.log('PORT :: \x1b[43m%s\x1b[0m' , PORT )
    })
}catch( ex ){
    console.log( "Err >> " + ex )
}