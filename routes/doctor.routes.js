// ==========================================
// Name  :	doctor.routes.js
// Author:	Patrick Salguero
// Date  :	dom, 11 de feb , 2018
// Descr :	Archivo de rutas del Doctor
// ==========================================

var express = require('express')
var app     = express()

var mdlauth = require('../middlewares/auth')
var doctorCtrl = require('../controllers/DoctorController')

//	Rutas de configuracion
app.get('/' , doctorCtrl.getListAllDoctor )

app.get('/:id' , doctorCtrl.getDoctorById )

app.post('/' , mdlauth.verifyJWT , doctorCtrl.saveDoctor )

app.put('/:id' , mdlauth.verifyJWT , doctorCtrl.updateDoctorByID )

app.delete('/:id' , mdlauth.verifyJWT , doctorCtrl.deleteDoctorByID )

module.exports = app

