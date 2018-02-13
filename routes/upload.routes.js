// ==========================================
// Name  :	upload.routes.js
// Author:	Patrick Salguero
// Date  :	lun, 12 de feb , 2018
// Descr :	Rutas para subir archivos
// ==========================================

const express  = require('express')
const fileUpload = require('express-fileupload')
const app      = express()
const auth     = require('../middlewares/auth')

const uploadCtrl = require('../controllers/UploadController')

app.use( fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }, }) )

app.put('/:collection/:id', uploadCtrl .uplodadFileByCollection )


module.exports = app