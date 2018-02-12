// ==========================================
// Name  :	seeker.routes.js
// Author:	Patrick Salguero
// Date  :	dom,11 de feb, 2018
// Descr :	Rutas para el buscador general
// ==========================================

const express = require('express')
const app     = express()

const seekerCtrl = require('../controllers/SeekerControoller')

//	Rutas para el buscador
app.get('/all/:text' , seekerCtrl.findInAll )

app.get('/collection/:collection/:text' , seekerCtrl.findByCollection )

module.exports = app