
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

//archivo carts

const cartsFilePath = path.join(__dirname, '../../carts.json');

const cartsstart = () => {
    if (!fs.existsSync(cartsFilePath)) {
        fs.writeFileSync(cartsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};


const cartssave = (carts) => {
    const data = JSON.stringify(carts, null, 2);
    fs.writeFileSync(cartsFilePath, data);
};

//inicio el archivo de carts
cartsstart()

//cargo los carts iniciales
let carts = cartsstart();

// endpoint get cart
router.get('/', (req, res) => {
    res.status(200).json(carts);
});

//endpoint get cart por id
router.get('/:cid', (req, res) => {
    const cartID = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartID);
    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(404).json({ msg: "no se encontró el carrito" });
    }
});

//endpoint post crear cart
router.post('/', (req, res) => {
    const { products } = req.body;
    let cartIDmax = 0;
    if (carts.length > 0) {
        cartIDmax = carts.reduce((max, cart) => cart.id > max ? cart.id : max, 0);
    }
    const newcart = {
        id: cartIDmax + 1,
        products: products || []
    };

    carts.push(newcart);
    cartssave(carts);
    res.status(201).json(newcart);
});

//endpoint post modificar cantidades en un cart
router.post('/:cid/product/:pid', (req, res) => {
    const cartID = parseInt(req.params.cid);
    const prodID = parseInt(req.params.pid);
    const { quantity } = req.body;
    const cart = carts.find(cart => cart.id === cartID);

    if (!cart) {
        return res.status(404).json({ msg: `Carrito con id: ${cartID} no encontrado` });
    }
    const product = cart.products.find(product => product.id === prodID);
    if (!product) {
        return res.status(404).json({ msg: `Producto con id: ${prodID} no encontrado en el carrito` });
    }
    product.quantity += quantity;
    cartssave(carts);
    res.status(200).json({ msg: `Producto con id: ${prodID} actualizado correctamente, cantidad agregada: ${quantity}` });
});

//endpoint delete
router.delete('/:cid/product/:pid', (req, res) => {
    const cartID = parseInt(req.params.cid);
    const prodID = parseInt(req.params.pid);
    const cart = carts.find(cart => cart.id === cartID);
    if (!cart) {
        return res.status(404).json({ msg: `el Carrito con id: ${cartID} no se encontró` })
    }
    cart.products = cart.products.filter(product => product.id !== prodID);

    res.status(200).json({ msg: `se eliminó el producto con id: ${prodID} del carrito con id ${cartID}` });
    cartssave(carts);
})

module.exports = router;
