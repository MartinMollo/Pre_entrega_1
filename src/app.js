const express = require("express")
const app = express()
const PORT = 8080



// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// LISTENER

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})