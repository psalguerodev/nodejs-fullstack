// ==========================================
// Name  :	SeekerControoler.js
// Author:	Patrick Salguero
// Date  :	dom, 11 de feb , 2018
// Descr :	Metodos para la busqueda total
// ==========================================

const Hospital = require('../models/Hospital')
const Doctor   = require('../models/Doctor')
const User     = require('../models/User')


// ==========================================
// Busqueda por colleccion segun parametro
// ==========================================
const findByCollection = ( request , response , nextFunction ) => {
    const collection = request.params.collection
    const findText   = request.params.text
}


// ==========================================
// Busqueda en collecciones del Sistema
// Hospitales / Doctores / Usuarios
// ==========================================
const findInAll = ( request , response , nextFunction ) => {

    let textFind = request.params.text

    //	Expresion regular que permite escapar las mayusculas
    let regExt = new RegExp( textFind , 'i');

    Promise.all([ findAllHospitalByText( textFind , regExt ) , 
                  findAllDoctorByText( textFind , regExt ) ,
                  findAllUserByText( textFind , regExt )
    ]).then( results => {

        return response.status(200).json({
            ok : true ,
            search : textFind ,
            hospitals : results[0],
            doctors : results[1] ,
            users : results[2]
        })
    })

}

// ==========================================
// Busqueda de Docotores por Expresion Reg.
// ==========================================
const findAllDoctorByText  = ( text , regExt) => {
    return new Promise( (resolve ,reject ) => {
        Doctor.find( { name : regExt })
        .populate('hospital', 'name')
        .populate('user', 'name , email')
        .limit(10)
        .exec( (err , result ) => {
            if( err ) reject('Error al buscar Doctores.' , err )
            if( result != null ){
                resolve( result )
            }
        })
    })
}

// ==========================================
// Busqueda de Hospitales por Expresion Reg.
// ==========================================
const findAllHospitalByText = ( text , regExt ) => {
    return new Promise( (resolve, reject ) => {
        Hospital
        .find( { name : regExt })
        .populate('user' ,'email , name')
        .limit(10)
        .exec( (err , result ) => {
            if( err ) reject('Error al buscar Hospitales.' , err )
            if(  result != null  ){
                resolve( result )
            }
        })
    })
}

// ==========================================
// Busqueda de Usuarios por Expresion Reg.
// ==========================================
const findAllUserByText = ( text , regExt ) => {
    return new Promise( (resolve , reject ) => {
        User.find( {} , 'email , name , role')
        .or( [ { name: regExt } , { email : regExt } ] )
        .limit(10)
        .exec( ( err , result ) => {
            if( err ) reject('Error al buscar Usuarios. ', err )
            if( result != null ){
                resolve( result )
            }
        })
    })
}


module.exports = {
    findInAll
}