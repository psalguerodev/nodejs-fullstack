// ==========================================
// Name  :	google-signin.routes.js
// Author:	Patrick Salguero
// Date  :	vie, 16 de feb 2018
// Descr :	Rutas para realizar login desde
// Google SignIn
// ==========================================

const express = require('express')
const app = express()

const googleCtrl = require('../controllers/GoogleSignInController')

//	Configuracion de la rutas

app.post( '/google', googleCtrl.verifyTokenGoogleSignIn );

module.exports  = app