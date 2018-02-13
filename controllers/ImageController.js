// ==========================================
// Name  :	ImageController.js
// Author:	Patrick Salguero
// Date  :	mar,13 de feb , 2018
// Descr :	Metodos para mostrar imagenes
// ==========================================

// Modelos Mongoose
const User = require('../models/User')
const Hospital = require('../models/Hospital')
const Doctor = require('../models/Doctor')
const fs = require('fs')
const models = [ 'users', 'hospitals' , 'doctors' ]

const showImageByCollectionAndFilename = ( request , response , nextFunction ) => {
    let collection = request.params.collection
    let filename = request.params.filename
    let default_path = './assets/default_image.jpg'
    let base_path = ''

    //	Validar si la collecion seleccionada es correcta
    if( models.indexOf( collection ) < 0 ) {
        return response.status(400).json({
            ok : false ,
            message: 'El modelo o collecion no es correcta.'
        })
    }

    //	Mostrar el __dirname
    console.log('Dirname__ ' + __dirname )

    //	Generar el path del archivo
    base_path = `./uploads/${collection}/${filename}`

    //	Validar si no exsite el archivo
    if( !fs.existsSync( base_path ) ){
        return response.sendfile( default_path )
    }

    //	Mostrando la imagen del servidor al cliente
    return response.sendfile( base_path )

}

module.exports = {
    showImageByCollectionAndFilename
}
