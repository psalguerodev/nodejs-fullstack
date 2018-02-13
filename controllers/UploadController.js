// ==========================================
// Name  :	UploadController.js
// Author:	Patrick Salguero
// Date  :	lun, 12 de feb , 2018
// Descr :	Metodos para subir archivos del Sistema
// ==========================================

const fs = require('fs')

//	Modelos Mongoose  
const Hospital = require('../models/Hospital')
const Doctor   = require('../models/Doctor')
const User     = require('../models/User')

const models = ['users' , 'hospitals' , 'doctors' ]

const uplodadFileByCollection = ( request , response , nextFunction ) => {
    
    const id = request.params.id
    const collection = request.params.collection

    //	Validando que sea una collecion correcta
    if( models.indexOf( collection ) < 0 ){
        return response.status(400).json({
            ok : false , 
            message : 'La colleccion es incorrecta , permitidos : ' + models.join(', '),
            errors : { message : 'La colleccion es incorrecta , permitidos : ' + models.join(', ') }
        })
    }

    //	Validacion si no viene un archivo en el request
    if( !request.files ){
        return response.status(400).json({
            ok : false ,
            message: 'No ha seleccionado ningún archivo',
            errors : { message: 'No ha seleccionado ningún archivo'}
        })
    }

    //	Validando el archivo recibido en el request
    let samplefile = request.files.image
    let filename   = samplefile.name.split('.')
    let extension  = filename[ filename.length - 1 ]
    let path_file  = ''

    console.log('Archivo recibido: ' , samplefile )
    console.log('Path file: ' + path_file )
    console.log('Collection: ' + collection )
    console.log('Id : ' + id )
    
    //	Extensiones permitidas para imagenes
    const allowedExt = ['jpg','jpeg','png','gif']

    //	Extension no permitida  
    if( allowedExt.indexOf( extension.toLowerCase() ) < 0  ){
        return response.status(400).json({
            ok : false ,
            message : 'La extensión del archivo es incorrecto, permitidas : ' + allowedExt.join(', '),
            errors : { message : 'La extensión del archivo es incorrecto, permitidas : ' + allowedExt.join(', ') }
        })
    }

    //	Generando nombre de archivo a subir
    let filename_upload = `${id}-${ new Date().getMilliseconds()}.${extension}`
    
    path_file = `./uploads/${collection}/${filename_upload}`
    
    console.log('Filename Upload: ' + filename_upload )
    console.log('Path file: ' + path_file )

    samplefile.mv( path_file , (err) => {
        //	Control del errores
        if( err ) {
            return response.status(500).json({
                ok : false ,
                message: 'Ha ocurrido un error al subir imagen',
                errors : err,
                extension : extension
            })
        }

        //	Actualizar el id de la coleccion seleccionada
        uploadByCollectionAndId( id , filename_upload , collection , response );

    })
    
}

const uploadByCollectionAndId = ( id , filename  , collection , response ) => {
    switch( collection.toLowerCase() ){
        case 'users':
            //	Busqueda de la persona
            User.findById( id , ( err , user ) => {
                if ( user != null ) {
                    if( user.img  ){
                        let oldpath = './uploads/users/' + user.img
                        console.log(oldpath)
                        //	Validar si exista el path anterior y eliminar path
                        if( fs.existsSync( oldpath ) ){
                            fs.unlink( oldpath )
                            console.log('borrado')
                        }
                    }

                    //	Actualizar datos del usuario
                    user.img = filename

                    user.save( (err , userupdated ) => {
                        userupdated.password = undefined

                        return response.status(200).json({
                            ok : true ,
                            message: 'Imagen del usuario ' + userupdated.name + ' actualizado.',
                            user : userupdated
                        })
                    })
                }
            })
        break;
        case 'hospitals':
            
        break;
        case 'doctors':
            
        break;
        default:
        break;
    }
}


module.exports = {
    uplodadFileByCollection
}