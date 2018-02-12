// ==========================================
// Name  :	login.js
// Author:	Patrick Salguero
// Date  :	11 de Feb , 2018
// Descr :	Metodos para el login del Sistema
// ==========================================
const express  = require('express')
const app      = express()
const bcrypt   = require('bcrypt')
const jwt      = require('jsonwebtoken')
const config   = require('../config/configuration')


const User     = require('../models/User')
const key_secret = config.KEY_SECRET

// ==========================================
// Metodo para ejecutar el login con JWT
// ==========================================
app.post('/', (req, res) => {

    const body = req.body

    User.findOne( {email : body.email } , ( err , result ) => {
        
        //	Controlando si sucede algun error
        if( err ) {
            return res.status(500).json({
                ok : false,
                message : 'Error al buscar usuario',
                errors : err
            })
        }

        //	Controlador si no se encuentra usuario
        if( result == null ){
            return res.status(400).json({
                ok : false ,
                message: 'Credenciales incorrecta - Email'
            })
        }

        //	Verificar si las constraseñas son incorrectas
        if( !bcrypt.compareSync( body.password , result.password ) ){
            return res.status(400).json({
                ok : false ,
                message: 'Credenciales incorrecta - Password'
            })
        }

        //	Generar JWT  - Token de autentificación
        result.password = undefined
        const token = jwt.sign( { user : result  } , key_secret , { expiresIn: 14400 } ) // 4 Horas

        //	Credenciales correctas
        return res.status(200).json({
            ok : true,
            token : token,
            message : 'Login correcto',
            body : result,
            id : result._id
        })
       
    })
    
})


module.exports = app