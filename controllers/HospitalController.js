// ==========================================
// Name  :	HospitalController.js
// Author:	Patrick Salguero
// Date  :	dom, 11 de Feb , 2018
// Descr :	Metodos para las routes del Hospital
// ==========================================

const Hospital = require('../models/Hospital')


// ==========================================
// Listar todos los Hospitales de la DB
// ==========================================
const getListAllHospitals = ( request , response , nextFunction ) => {
    
    let since = request.query.since || 0
    since = Number( since )

    Hospital.find({})
        .populate('user', 'email , name ')
        .skip( since )
        .limit(2)
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
    deleteHospital
}