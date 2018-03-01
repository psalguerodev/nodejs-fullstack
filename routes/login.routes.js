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
const verify   = require('../middlewares/auth')

const User     = require('../models/User')
const key_secret = config.KEY_SECRET

// ==========================================
// Generar un nuevo token
// ==========================================
app.post('/renewtoken' , verify.verifyJWT  , ( req , res , next ) => {
  let user = req.user

  //	Generar token
  const token = jwt.sign( { user : user  } , key_secret , { expiresIn: 14400 } ) // 4 Horas

  return res.status(200).json({
    ok : true ,
    token : token
  })

})


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

        //	Verificar si tiene login por google
        if( result.google ) {
            return res.status(400).json({
                ok: false ,
                message : 'El usuario ' + body.email + ' no autentificación por password'
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
            id : result._id,
            menu : getMenuList( result.role )
        })
       
    })
    
})

const getMenuList = ( role ) => {
    let menu = [
        {
          title : 'Principal',
          icon  : 'mdi mdi-gauge',
          submenu : [
            {
              title : 'Dashboard',
              path  : '/dashboard'
            },
            {
              title : 'Barra de Progreso',
              path  : '/progress'
            },
            {
              title : 'Graficas',
              path  : '/graphone'
            },
            {
              title : 'Promesas',
              path  : '/promises'
            },
            {
              title : 'Observables Rxjs',
              path  : '/rxjs'
            },
          ]
        },
        {
          //Mantenimientos
          title : 'Mantenimientos',
          icon : 'mdi mdi-folder-lock-open',
          submenu : [
            {
              title : 'Hospitales',
              path: '/hospitals'
            },
            {
              title: 'Doctores',
              path : '/doctors'
            }
          ]
        }
      ]

      if( role.trim() === 'ADMIN_ROLE' ){
        menu[1].submenu.unshift( { title: 'Usuarios' , path:'/users' })
      }

      return menu
}


module.exports = app