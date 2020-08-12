const express = require('express');
const { request } = require('express');
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

cart.put('/:id', (req,res)=>{
    res.json("update the cart item");
    res.status(200);
})

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