// ==========================================
// Name  :	image.routes.js
// Author:	Patrick Salguero
// Date  :	mar 13 de feb 2018
// Descr :	Rutas para mostrar imagenes por 
// colecciones
// ==========================================

const express = require('express')
const app = express()

const imageCtrl = require('../controllers/ImageController')

app.get('/:collection/:filename' , imageCtrl.showImageByCollectionAndFilename )


module.exports  = app