// 1. IMPOTACIONES
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const Book = require('./models/book')

// 2. MIDDLEWARES
require('dotenv').config()
app.use(express.static('./public'))
app.set('view engine', 'hbs')
// 3. RUTAS
app.get('/', (req, res) => {
    res.render('index')
})
// 4. SERVIDOR
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT)
})
