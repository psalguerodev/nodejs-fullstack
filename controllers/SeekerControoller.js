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
    let collection = request.params.collection
    let findText   = request.params.text

    let regExt = new RegExp( findText , 'i' )

    console.log('Buscando : ' + findText )
    console.log('Colleccion a Buscar: ' + collection )

    switch( collection.toLowerCase() ){
        case 'doctors':
            console.log('Busqueda de doctor.');
            findAllDoctorByText( findText , regExt ).then( doctors => {
                return response.status(200).json({
                    ok: true ,
                    search: findText ,
                    doctors : doctors,
                    collection : collection
                })
            }).catch( err => console.log('Error ', err ))
        break;
        case 'hospitals':
            console.log('Busqueda de hospital.');
            findAllHospitalByText( findText , regExt ).then( hospitals => {
                return response.status(200).json({
                    ok : true ,
                    search : findText ,
                    hospitals : hospitals ,
                    collection : collection
                })
            })
        break;
        case 'users':
            console.log('Busqueda de usuarios')
            findAllUserByText( findText , regExt ).then( users => {
                return response.status(200).json({
                    ok : true ,
                    search : findText ,
                    users : users ,
                    collection : collection
                })
            }).catch( err => console.log('Erro en Usuarios', err ))
        break;

        default :
            console.log('Coleccion no correcta')
            return response.status(200).json({
                ok : false ,
                search : findText,
                collection : collection,
                message: 'La coleccion indicada no es correcta.'
            })
        break;
    }

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
        .populate('user', 'name , email , img')
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
        .populate('user' ,'email , name , img')
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
        User.find( {} , 'email , name , role , img , google')
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
    findInAll,
    findByCollection
}