const express = require("express")
require("./dbConnect/db")
require('dotenv').config();

var bodyParser = require("body-parser");
var bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const addressRoutes = require('./routes/adress')

const app = express()
app.use(cors());

port = 3005 ;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());
app.get('/', (req, res) => { 
  res.send('Hello from Fyp Food Server');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/auth' , authRoutes)
app.use('/products' , productRoutes) 
app.use('/category' , categoryRoutes)
app.use('/cart' , cartRoutes)
app.use('/order' , orderRoutes)
app.use('/address' , addressRoutes)


app.listen(port, () => console.log(`App is Running in ${port}.`));