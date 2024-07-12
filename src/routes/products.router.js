
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsfilepath = path.join(__dirname, '../../products.json');

//archivo products
const productsstart = () => {
    if (!fs.existsSync(productsfilepath)) {
        fs.writeFileSync(productsfilepath, JSON.stringify([]));
    }
    const data = fs.readFileSync(productsfilepath, 'utf-8');
    return JSON.parse(data);
};

const productssave = (products) => {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(productsfilepath, data);
};

//inicio el archivo de products
productsstart();

// cargo los products iniciales
let products = productsstart();

//endpoint get products
router.get('/', (req, res) => {
    res.status(200).json(products);
});

router.get('/:pid', (req, res) => {
    const prodID = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodID);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ msg: " no se encontró el producto" });
    }
});

//endpoint post products
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let prodIDmax = products.reduce((max, product) => product.id > max ? product.id : max, 0)
    if (!title || !description || !code || price <= 0 || stock <= 0 || !category) {
        res.status(400).json({ msg: "el producto fue mal ingresado" })
    } else {
        const newproduct = {
            id: prodIDmax + 1,
            title,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category,
            thumbnails
        };

        products.push(newproduct);
        productssave(products);
        res.status(200).json(newproduct);
    }
});

//endpoint put products
router.put('/:pid', (req, res) => {
    const prodID = parseInt(req.params.pid);
    const product = products.find((product) => product.id === prodID);

    if (product) {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
        product.thumbnails = thumbnails ?? product.thumbnails;

        productssave(product);
        res.json(product);
    } else {
        res.status(404).json({ msg: "no se econtró el producto" });
    }
});

//endpoint delete products
router.delete('/:pid', (req, res) => {
    const prodID = parseInt(req.params.pid);
    products = products.filter((product) => product.id !== prodID);
    productssave(products)
    res.status(200).json({ msg: `se eliminó el producto con id: ${prodID}` });
});

module.exports = router;

