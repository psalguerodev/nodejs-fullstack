// ==========================================
// Name  :	GoogleSigIncontroller.js
// Author:	Patrick Salguero
// Date  :	vie,16 de feb 2018
// Descr :	Metodos para validar token de 
// Google SignIn
// ==========================================

const { GoogleAuth , OAuth2Client } = require('google-auth-library')
const auth  = new GoogleAuth   
const jwt   = require('jsonwebtoken')
const config = require('../config/configuration')
const User = require('../models/User')

const verifyTokenGoogleSignIn = ( request , response , nextFunction ) => {
    const token = request.body.token
    let client = null 
    let payload = null

    //	En caso del token no es enviado en el cuerpo de la pagina
    if( !token ) {
        return response.status(400).json({
            ok : false ,
            message : 'El token es requerido.'
        })
    }
    
    //	Creando el cliente para validar el token
    client = new OAuth2Client( config.GOOGLE_CLIENT_ID , config.GOOGLE_SECRET_KEY , '' )
    
    client.verifyIdToken( { idToken : token } , ( err ,login ) => {
        //	En caso que suceda algun error
        if( err ) {
            return response.status(400).json({
                ok : false ,
                message : 'Ha ocurrido un error en Login Google SignIn',
                errors : err 
            })
        }

        //	En caso no regrese ningun usuario
        if( !login ) {
            return response.status(404).json({
                ok : false ,
                message : 'No se ha encontrado el usuario.'
            })
        }

        //	Proceso para guardar un usuario desde el payload
        payload = login.payload

        //	Buscar si existe un usuario con el correo
        User.findOne( { email: payload.email } , ( err , result ) => {
            //	En caso suceda un error al buscar
            if( err ) {
                return response.status(500).json({
                    ok : false ,
                    message : 'Ha ocurrido un error al buscar usuario ' + payload.email ,
                    errrors : err,
                    payload : payload
                })
            }

            //	En caso si existe un usuario con el email
            if( result ) {
                
                if( !result.google ) {
                    return response.status(400).json({
                        ok : false ,
                        message: 'El usuario ' + payload.email  + ' no tiene autentificacion por Google.'
                    })
                }

                //	Crear un nuevo token
                result.password = undefined
                const token = jwt.sign( { user : result  } , config.KEY_SECRET , { expiresIn: 14400 } ) // 4 Horas
        
                //	Credenciales correctas
                return response.status(200).json({
                    ok : true,
                    token : token,
                    message : 'Login correcto',
                    body : result,
                    id : result._id,
                    menu : getMenuList( result.role )
                })

            }

            //	Guardar un usuario creado con Autentificacion de Google Sign In
            const user = new User({
                google : true , 
                name : payload.name,
                img : payload.picture,
                email : payload.email,
                password : 'googlesignin',
                role : 'USER_ROLE'
            })

            user.save( (err , result ) => {
                if( err ) {
                    return response.status(500).json({
                        ok : false ,
                        message : 'Ha ocurrido un error al guardar usuario ' + payload.email ,
                        errrors : err,
                    })
                }

                //	Generando token de autenficacion
                result.password = undefined
                const token = jwt.sign( { user : result  } , config.KEY_SECRET , { expiresIn: 14400 } ) // 4 Horas

                return response.status(200).json({
                    ok : true,
                    token : token,
                    message : 'Login correcto',
                    body : result,
                    id : result._id,
                    menu : getMenuList( result.role )
                })

            })

        })

    })

}

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


module.exports = {
    verifyTokenGoogleSignIn
}