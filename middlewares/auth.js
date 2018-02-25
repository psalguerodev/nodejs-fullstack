// ==========================================
// Name  :	auth.js
// Author:	Patrick Salguero
// Date  :	dom 11 de Feb , 2018
// Descr :	Middlewara para la autentificacion
// ==========================================

const jwt    = require('jsonwebtoken')
const config = require('../config/configuration')


// ==========================================
// Middleware para verificar token - JWT
// ==========================================
const verifyJWT = (req, res, next) => {
    
    const secret= config.KEY_SECRET
    const token = req.query.token

    if( token == null || token == undefined ){
        return res.status(400).json({
            ok : false,
            message : 'El token es obligatorio'
        })
    }

    jwt.verify( token , secret , (err , decoded ) => {
        if( err ){
            return res.status(401).json({
                ok : false,
                message: 'Token inválido , vuelve a intetarlo.',
                errors : err
            })
        }
    
        //	Si el token es correcto
        req.user = decoded.user
        next()
    })

}


const verifyAdmin = ( request , response , next ) => {
    let user = request.user

    //	En caso que si es un admin el usuario
    if( user.role === 'ADMIN_ROLE' ){
        return next()
    }

    //	En caso no es admin
    return response.status(401).json({
        ok : false ,
        message: 'El usuario que realizá la petición no es Administrador.',
        errors : { message : 'No tiene acceso para realizar la petición'}
    })

}

const verifyAdminOrdSomeUser = ( request , response , next ) => {
    let user = request.user
    let id = request.params.id || null

    //	En caso que si es un admin el usuario
    if( user.role === 'ADMIN_ROLE'  || user._id == id ){
        return next()
    }

    //	En caso no es admin
    return response.status(401).json({
        ok : false ,
        message: 'El usuario que realizá la petición no es Administrador ni el mismo usuario.',
        errors : { message : 'No tiene acceso para realizar la petición'}
    })
}



module.exports  = {
    verifyJWT,
    verifyAdmin,
    verifyAdminOrdSomeUser
}