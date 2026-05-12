const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')


const app = express()
const PORT = process.env.PORT || 3000

// Middlewares globales
app.use(cors())
app.use(express.json())

// Rutas
app.use('/auth', authRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: '🚀 Servidor funcionando correctamente' })
})

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})