const express = require('express');
const path = require('path');

const Contenedor = require('./service/Contenedor');

let contenedor = new Contenedor('data/productos.txt');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.post('/productos', async (req, res) => {
    const { name, price, photo } = req.body;
    console.log("productos: ", name, price, photo);
    try {
        await contenedor.save(name, price, photo);//almaceno en el file el producto
        res.redirect('/');
    } catch (err) {
        res.status(500).json({
            message: 'Error al guardar el producto',
            err
        });
    }
})

app.get('/productos', async (req, res) => {
    let productos;
    try {
        productos = await contenedor.getAll();
        console.log(productos);
        const products = productos;
        return res.render('pages/productos', {
            products: products,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los productos',
            error
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', err => {
    console.log(err);
});