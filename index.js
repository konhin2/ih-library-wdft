// 1. IMPOTACIONES
const { response } = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser    = require("body-parser")

const Book = require('./models/Book')

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
app.get('/books/create', (req, res) => {
    res.render('book-create')
})
app.post('/books/create', (req, res) => {
    const { title, author, description, rating} = req.body
    Book.create({title, author, description, rating})
        .then(() => {
            res.redirect('/books')
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

app.get('/books/:bookId/edit', (req, res) => {
    const { bookId } = req.params
    Book.findById(bookId)
        .then((foundBook) => {
            console.log("Libro encontrado", foundBook)
            res.render('book-edit', {
                book: foundBook
            })
        })
        .catch((err) => console.log(err))
})

app.post('/books/:bookId/edit', (req, res) => {
    // Parametros de la URL
    const { bookId } = req.params
    // Datos del formulario
    const { title, author, description, rating } = req.body

    Book.findByIdAndUpdate(bookId, {title, author, description, rating}, {new: true})
        .then((bookUpdated) => {
            res.redirect(`/books/${bookUpdated.id}`)
        })
        .catch((err) => console.log(err))
})

app.post('/books/:bookId/delete', (req, res) => {
    const { bookId } = req.params
    Book.findByIdAndDelete(bookId)
        .then(() => res.redirect("/books"))
        .catch((err) => console.log(err))
})

// 4. SERVIDOR
// 
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT)
})
