// ==========================================
// Name  :	DoctorController.js
// Author:	Patrick Salguero
// Date  :	dom,11 de feb , 2018
// Descr :	Metodos para la rutas del Doctor
// ==========================================

const Doctor   = require('../models/Doctor')
const fs       = require('fs')

// ==========================================
// Listado total de Doctores DB
// ==========================================
const getListAllDoctor = ( request , response , nextFunction ) => {
    
    let since = request.query.since || 0
    since = Number( since )

    Doctor.find({})
        .populate('user' , 'email , name ')
        .populate('hospital', 'name')
        // .skip( since )
        // .limit(5)
        .exec(( err , results ) => {
            //	Control si hay error al listar
            if( err ){
                return response.status(200).json({
                    ok: false,
                    message: 'Ha ocurrido un error al listar Doctores'
                })
            }
            
            Doctor.count({} , (err, count ) => {
                //	Mandar la informacion de la lista
                return response.status(200).json({
                    ok: true,
                    doctors: results ,
                    total: count
                })
            })

        })
}

// ==========================================
// Obtener un Doctor por ID
// ==========================================
const getDoctorById = ( request , response , nextFunction ) => {
    const id_doctor = request.params.id || null
    Doctor.findById( id_doctor )
          .populate( 'hospital' , 'name img')
          .exec( (err , result ) => {
        if( err ) {
            return response.status(500).json({
                ok : false ,
                message : 'Error al buscar Doctor con ID ' + id_doctor,
                errors : err
            })
        }

        //	En caso el Doctor con el ID seleccionado no existe
        if( !result ) {
            return response.status(404).json({
                ok: false ,
                message: 'El Doctor con ID ' + id_doctor + ' no existe.'
            })
        }

        //	En caso el Doctor sleccionado si existe
        return response.status(200).json({
            ok : true , 
            message: 'El doctor se ha encontrado' ,
            doctor : result
        })

    })
}

// ==========================================
// Guardar un nuevo Doctor
// ==========================================
const saveDoctor = ( request , response , nextFunction ) => {
    const body = request.body
    const user = request.user

    const doctor = new Doctor({
        name: body.name,
        img : body.img,
        user: user,
        hospital: body.hospital
    })

    doctor.save( (err , result ) => {
        //	Control de error 
        if( err ){
            return response.status(400).json({
                ok : false ,
                message: 'Error al guardar la información'
            })
        }

        //	Control si no devuelve algun valor
        if( !result ) {
            return response.status(500).json({
                ok : true ,
                message : 'Ha ocurrido un error al guardar información del Doctor.'
            })
        }

        //	Todo correcto para mostrar la informacion rest
        return response.status(200).json({
            ok : true ,
            doctor: result
        })

    })

}

// ==========================================
// Actualizar un Doctor por ID
// ==========================================
const updateDoctorByID = ( request , response , nextFunction ) => {
    const body = request.body
    const id = request.params.id
    const user = request.user
    

    Doctor.findByIdAndUpdate( id , body ,  ( err , result ) => {
        if( err ){
            return response.status(400).json({
                ok : false, 
                message: 'Ha ocurrido un error al actualizar el Doctor.',
                errors : err
            })
        }

        if( !result ){
            return response.status(404).json({
                ok : false,
                message: 'No se ha encontrado Doctor'
            })
        }

        //	Doctor actualizado corretamente
        return response.status(200).json({
            ok : true,
            doctor : result
        })

    })

}

// ==========================================
// Eliminar un Doctor por ID
// ==========================================
const deleteDoctorByID = ( request , response , nextFunction ) => {
    const id = request.params.id

    Doctor.findByIdAndRemove( id , (err , result )=> {
        if ( err ){
            return response.status(400).json({
                ok : false ,
                message : 'Ha ocurrido un error al eliminar Doctor.'
            })
        }

        if( !result ){
            return response.status(404).json({
                ok : false,
                message: 'No se ha encontrado Doctor con el ID: '+ id
            })
        }

        // Eliminar imagen del servidor
        let path_file = './uploads/doctors/' + result.img
        if( fs.existsSync( path_file ) ) {
            fs.unlink( path_file )
        }

        return response.status(200).json({
            ok : true ,
            doctor  : result
        })
    })
}

module.exports = {
    getListAllDoctor,
    saveDoctor,
    updateDoctorByID,
    deleteDoctorByID,
    getDoctorById
}