// ==========================================
// Name  :	Doctor.js
// Author:	Patrick Salguero
// Date  :	dom 11 de Feb , 2018
// Descr :	Modelo Mongoose del Doctor
// ==========================================

const mongoose = require('mongoose')
const Schema   = mongoose.Schema

// ==========================================
// Schema del Doctor - Mongo DB
// ==========================================
const doctorSchema = new Schema({
    name : { type: String , required: [true , 'El nombre del Doctor es obligatorio.' ]},
    img  : { type: String , required: false },
    user : { type: Schema.Types.ObjectId , ref: 'User' , required : true },
    hospital : { type: Schema.Types.ObjectId , ref: 'Hospital' , required : [true , 'El id del Hospital es obligatorio.'] }
})

module.exports = mongoose.model('Doctor' , doctorSchema )