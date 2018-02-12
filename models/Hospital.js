// ==========================================
// Name  :	Hospital.js
// Author:	Patrick Salguero
// Date  :	dom 11 de Feb , 2018
// Descr :	Modelo Mongoose del Hospital
// ==========================================

const mongoose = require('mongoose')
const Schema   = mongoose.Schema

// ==========================================
// Schema del Hospital - Mongo DB
// ==========================================
const hospitalSchema = new Schema({
    name : { type : String , required : [ true , 'El nombre del Hospital es obligatorio' ]} ,
    img  : { type : String , required : false },
    user : { type : Schema.Types.ObjectId , ref: 'User' }
})

module.exports = mongoose.model('Hospital' , hospitalSchema )