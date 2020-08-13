const express = require('express');
const cart = express.Router();

let myCart = [
    {id: 1, product:'GATORADE', price: 5.0, quantity: 5},
    {id: 2, product:'POWERADE', price: 3.0, quantity: 2},
    {id: 3, product:'Vitamin Water', price: 1.0, quantity: 1},
    {id: 4, product:'BODYARMOR', price: 3.00, quantity: 8}
]

cart.get('/', (req, res) => {
    res.json(myCart)
    res.status(200);
})

cart.get('/:id', (req, res) =>{
    let item = myCart.find((current)=>{
        if (current.id === parseInt(req.params.id)){;
        return current;
    }
    })
    res.json(item);
    res.status(200);
})

cart.get('/', (req, res) => {
    let cart = [...myCart];
    if (req.query.maxPrice) {
        filtered = cart.filter(item => item.price <= req.query.maxPrice)
    };
       res.json(filtered);
    res.sendStatus(200); 
    
    });

cart.post('/',(req,res)=>{
    let item ={
        id: myCart.length + 1,
        product: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity
    
    };
    myCart.push(item);
    res.json(item);
    res.status(201);
})

cart.put('/:id', (req, res) => {
    if (req.body) {
        let product = cart.find((obj) => obj.id === parseInt(req.params.id));
        if (req.body.product) {
            product.product = req.body.product 
        }
        if (req.body.price) {
            product.price = req.body.price
        }
        if (req.body.quantity) {
            product.quantity = req.body.quantity
        }
        res.status(200);
        res.json(product);
    } else {
        res.status(404);
        res.json('There are no products matching the submitted ID.')
    }
});

cart.delete('/:id', (req, res)=> {
    const reqId = req.params.id;

    let item = myCart.filter(item =>{
        return item.id === reqId;
    });
    const index = myCart.indexOf(item);
    myCart.splice(index,1);

    res.json({message:`item ${reqId} deleted`});
    res.status(204);

});
   
module.exports = cart;