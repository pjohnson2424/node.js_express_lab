"use strict"
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const port = 3000;
let cart = require('./cart');

app.use('/cart-items', cart);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.get('*',(req,res)=>{
    res.json({ message: 'no sir'});
})

app.listen(port,()=> {console.log(`server listening on port ${port}`)});
