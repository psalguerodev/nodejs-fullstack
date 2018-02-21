// ==========================================
// Name  :	hospital.routes.js
// Author:	Patrick Salguero
// Date  :	dom, 11 de feb, 2018
// Descr :	Archivo de config de rutas Hospital
// ==========================================

const express = require('express')
const app     = express()
const mdlware = require('../middlewares/auth')

const hospitalCtrl = require('../controllers/HospitalController')

//	Rutas del Hospital
app.get('/' , hospitalCtrl.getListAllHospitals )

app.get('/:id' , hospitalCtrl.getHospitalById )

app.post('/' , mdlware.verifyJWT , hospitalCtrl.saveHospital )

app.put('/:id' , mdlware.verifyJWT , hospitalCtrl.updateHospital )

app.delete('/:id' , mdlware.verifyJWT , hospitalCtrl.deleteHospital )


module.exports = app