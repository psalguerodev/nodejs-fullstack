// ==========================================
// Name  :	user.js - Model
// Author:	Patrick Salguero
// Date  :	10 de Feb 2018
// Descr :	Model Mongoose para usuario DB
// ==========================================
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const roles_validate = {
    values : ['ADMIN_ROLE' , 'USER_ROLE'],
    message : '{VALUE} no es un rol permitido.'
}

// ==========================================
// Schema de usuario MongoDB
// ==========================================
const userSchema = new Schema({
    name : {type: String , required : [true , 'El nombre es requerido'] } ,
    email: { type: String , unique: true, required: [true , 'El email es requerido'] },
    password: { type: String , required: [true , 'La clave es necesaria'] },
    img : { type: String , require : false },
    role : { type: String , required : true , default : 'USER_ROLE' , enum : roles_validate},
    google : { type: Boolean , required : true, default : false  }
})

userSchema.plugin( uniqueValidator , { message: '{PATH} debe ser único.' })

module.exports = mongoose.model('User', userSchema )