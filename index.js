// 1. IMPOTACIONES
const { response } = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser    = require("body-parser")

const Book = require('./models/book')

// 2. MIDDLEWARES
require('dotenv').config()

mongoose.connect(process.env.MONGODB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectados a MongoDB'))
    .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('./public'))
app.set('view engine', 'hbs')

// 3. RUTAS
app.get('/', (req, res) => {
    res.render('index')
})

app.get("/books", (req, res) => {
    Book.find({})
        .then((librosEncontrados) => {
            console.log(librosEncontrados)
            res.render('books', {
                books: librosEncontrados
            })
        })
        .catch((err) => console.log(err))
})

// QUERY PARAMS
app.get("/books/:bookId", (req, res) => {
    console.log("Este es el req.params", req.params)
    const { bookId } = req.params

    Book.findById(bookId)
        .then((singleBook) => {
            console.log("Libro encontrado", singleBook)
            res.render('singleBook', {
                libro: singleBook
            })
        })
        .catch((err) => console.log(err))
})

// QUERY STRINGS
app.get("/Search", (req, res) => {
    const queries = req.query
    res.render("search", {
        busqueda: queries
    })
})

app.post("/search", (req, res) => {
    const valorDelFormulario = req.body
    res.redirect(`/search?palabra=${valorDelFormulario.palabra}&nombre=${valorDelFormulario.nombre}&apellido=${valorDelFormulario.apellido}`)
})
// 4. SERVIDOR
// 
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT)
})
