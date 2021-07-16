// 1. IMPOTACIONES
const { response } = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

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
// 4. SERVIDOR
// 
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT)
})
