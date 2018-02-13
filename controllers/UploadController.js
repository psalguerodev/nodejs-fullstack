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
                if( err ) return response.status(500).json({ ok : false , errors : err})

                //	Validacion en caso el usuario no exista
                if( !user ){
                    return response.status(404).json({
                        ok : false ,
                        message : 'El usuarui con id : ' + id + ' no existe.'
                    })
                }

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
                        if( err ) return response.status(500).json({ ok : false , errors : err})
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
            // Busqueda de hospital por id
            Hospital.findById( id , ( err , hospital ) => {
                if( err ) return response.status(500).json({ ok : false , errors : err})

                //	Validacion en caso el hospital no exista
                if( !hospital ){
                    return response.status(404).json({
                        ok : false ,
                        message : 'El hospital con id : ' + id + ' no existe.'
                    })
                }

                if( hospital != null ){
                    if( hospital.img ){
                        let path_file = './uploads/hospitals/' + hospital.img
                        if( fs.existsSync( path_file ) ){
                            fs.unlink( path_file )
                        }
                    }

                    //	Actualizar perfil del hospital
                    hospital.img = filename
                    hospital.save( ( err , hospitalupdated ) => {
                        if( err ) return response.status(500).json({ ok : false , errors : err})
                        if( hospitalupdated != null ){
                            return response.status(200).json({
                                ok: true ,
                                hospital : hospitalupdated,
                                message : 'Se ha actualizado hospital ' + hospitalupdated.name 
                            })
                        }
                    })
                }
            })
        break;
        case 'doctors':
            //	Busqueda de doctores por id
            Doctor.findById( id ,( err , doctor ) => {
                if( err ) return response.status(500).json({ ok : false , errors : err})

                //	Validacion en caso el doctor no exista
                if( !doctor ){
                    return response.status(404).json({
                        ok : false ,
                        message : 'El doctor con id : ' + id + ' no existe.'
                    })
                }

                if( doctor != null ) {
                    if( doctor.img ){
                        let path_file = './uploads/doctors/' + doctor.img
                        if( fs.existsSync( path_file ) ) {
                            fs.unlink( path_file )
                        }
                    }

                    //	Actualizar los datos del doctor
                    doctor.img = filename
                    doctor.save( ( err , doctoruploaded ) => {
                        if( err ) return response.status(500).json({ ok : false , errors : err})
                        if( doctoruploaded != null ){
                            return response.status(200).json({
                                ok : true ,
                                message : 'El doctor ' + doctoruploaded.name + ' se ha actualizado',
                                doctor : doctoruploaded
                            })
                        }
                    })
                }
            })
        break;
        default:
        break;
    }
}


module.exports = {
    uplodadFileByCollection
}