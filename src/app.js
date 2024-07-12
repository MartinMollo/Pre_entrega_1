const express = require("express")
const app = express()
const PORT = 8080
const cartsRouter = require("./routes/carts.router.js")
const productRouter = require("./routes/products.router.js")

// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/carts", cartsRouter)
app.use("/api/products", productRouter)

// LISTENER

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})


