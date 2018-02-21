// ==========================================
// Name  :	HospitalController.js
// Author:	Patrick Salguero
// Date  :	dom, 11 de Feb , 2018
// Descr :	Metodos para las routes del Hospital
// ==========================================

const Hospital = require('../models/Hospital')
const fs  = require('fs')

// ==========================================
// Listar todos los Hospitales de la DB
// ==========================================
const getListAllHospitals = ( request , response , nextFunction ) => {
    
    let since = request.query.since || 0
    since = Number( since )

    Hospital.find({})
        .populate('user', 'email , name ')
        .exec((err , result ) => {
            //	Si ocurre un error al listar hospitales
            if( err ) {
                return response.status(500).json({
                    ok : false ,
                    message : 'Ha ocurrido un error al listar hospitales',
                    errors : err
                })
            }
    
           Hospital.count( {} , (err, count ) => {
                //	Si puedes obtener el listado de hospitales
                return response.status(200).json({
                    ok : true ,
                    hospitals: result ,
                    total : count
                })
           })
    
        })
}

// ==========================================
// Obtener Hospital por ID 
// ==========================================
const getHospitalById = ( request , response , nextFunction ) => {
    const hospital_id = request.params.id

    Hospital.findById( hospital_id )
            .populate( 'user' ,'name role img email')
            .exec( (err , hospital  ) => {
                // Control si existe algun error 
                if ( err ) {
                    return response.status(500).json({
                        ok : false , 
                        message : 'Ha ocurrido un error al buscar Hospital'
                    })
                }

                // En caso no se encuentre el hospital
                if( !hospital ) {
                    return response.status( 404 ).json({
                        ok : false ,
                        message: 'El Hospital con ID: ' + hospital_id + ' no existe'
                    })
                }


                //En caso el Hospital si existe
                return response.status(200).json({
                    ok : false ,
                    message: 'El Hospital se ha encontrado ',
                    hospital : hospital
                })

            })

}

// ==========================================
// Agregar nuevo Hospital
// ==========================================
const saveHospital = ( request , response , nextFunction ) => {
    const body = request.body
    const user = request.user

    const hospital = new Hospital({
        name : body.name,
        img  : body.img,
        user : user._id
    })

    hospital.save((err , hsptl  ) => {
        //	Control de errores
        if( err ){
            return response.status(400).json({
                ok: false,
                message : 'Ha ocurrido un error al ejecutar petición',
                errors : err
            })
        }

        //	Si no trae el nuevo hospital creado
        if ( !hsptl ){
            return response.status(500).json({
                ok: false,
                message : 'Ha ocurrido un error al ejecutar petición'
            })
        }

        //	El hospital se ha creado correctamente!
        return response.status(200).json({
            ok : true , 
            hospital : hsptl
        })

    })

}


// ==========================================
// Actualizar Hospital con ID
// ==========================================
const updateHospital = ( request , response , nextFunction ) => {
    const body = request.body
    const id   = request.params.id
    const user = request.user

    Hospital.findById( id , ( err , result ) => {
        if( err ) {
            return response.status(500).json({
                ok : false ,
                message : 'Ha ocurrido un errido al buscar Hospital.',
                errors : err
            })
        }

        if( !result ) {
            return response.status(404).json({
                ok : false ,
                message : 'El Hospital con ID :' + id + ' no se encuentra.'
            })
        }

        //	Se encuentra Hospital
        result.name = body.name
        result.user = user._id
        result.save( ( err , hsptl ) => {
            if( err ){
                return response.status(500).json({
                    ok : false ,
                    message : 'Ha ocurrido un errido al buscar Hospital.',
                    errors : err
                })
            }

            if( !hsptl ) {
                return response.status(404).json({
                    ok : false ,
                    message : 'El Hospital con ID :' + id + ' no se encuentra.'
                })
            }

            //	Todo correcto y se pudo actualizar
            return response.status(200).json({
                ok: true,
                hospital : result
            })

        })

    })
}


// ==========================================
// Eliminar Hospital con ID
// ==========================================
const deleteHospital = ( request , response , nextFunction ) => {
    const id  = request.params.id

    Hospital.findByIdAndRemove( id , ( err , result ) => {
        if( err ){
            return response.status(400).json({
                ok : false ,
                message: 'Ha ocurrido al eliminar Hospital.',
                errors : err
            })
        }

        if ( !result ) {
            return response.status(404).json({
                ok : false ,
                message: 'Hospital no encontrado'
            })
        }

        // Eliminar imagen del servidor
        let path_file = './uploads/hospitals/' + result.img
        if( fs.existsSync( path_file ) ) {
            fs.unlink( path_file )
        }

        return response.status(200).json({
            ok: true ,
            hospital: result 
        })
    })

}

module.exports = {
    saveHospital,
    getListAllHospitals,
    updateHospital,
    deleteHospital,
    getHospitalById
}