const express = require('express');
const pool = require('./connection');
const cart = express.Router();

function getData(filters) {
    const defaults = {
        limit: 10,
        filterType:'and'
    }
    let myFilters = { ...defaults, ...filters}
    let query = "select * from shopping_cart"
    let items = [];
    let data = [];
    if(myFilters.id){
        data.push(myFilters.id);
        items.push( `id = $${data.length}::int`)
    }
    if (myFilters.maxPrice) {
        data.push(myFilters.maxPrice);
       items.push(`price <= $${data.length}::int`)
    }
    if (myFilters.prefix) {
        myFilters.prefix += '%';
        data.push(myFilters.prefix);
        items.push(` product LIKE $${data.length}::character varying`)
    }
    if(items.length){
                query += ' WHERE ' + items.join(' AND ');
    }
    console.log(query, data);
    return pool.query(query, data)
  };

cart.get("/", function(req, res) {
    let array = {};
    array.maxPrice = req.query.maxPrice;
    array.prefix = req.query.prefix;
    array.pageSize = req.query.pageSize;
    getData(array).then(result=>{
        let data = result.rows;
        res.json(data);
      }).catch(error=>{
          console.log(error);
          res.sendStatus(500);
      });
  });

  cart.get('/:id',(request, response)=>{
    getData({id:request.data.id}).then(result => {
        let data = result.rows;
        response.json(data);
        
      }).catch(err=>{
          console.log(err);
          response.sendStatus(500);
      });
  });

  cart.post("/", (req,res)=>{
    if (req.body && req.body.product && req.body.price && req.body.quantity) {
        let itemValues = [
            req.body.product, req.body.price, req.body.quantity
        ];
        let item = {
            product: itemValues[0], price: itemValues[1], quantity: itemValues[2]
        }
        pool.query("INSERT INTO shopping_cart (product, price, quantity) VALUES ($1::text, $2::numeric, $3::numeric)", values)
        .then(()=>{
            res.status(201);
            res.json(item);
        }
        ).catch(error=>{
            console.log(error);
            res.sendStatus(500);
        })
    }
});

cart.put("/:id", (req,res)=>{
    if (req.body && req.body.product && req.body.price && req.body.quantity) {
        let values = [
            req.data.id, req.body.product, req.body.price, req.body.quantity
        ]
        let item = {
            product: values[1], price: values[2], quantity: values[3]
        }
        pool.query("UPDATE shopping_cart SET product=$2::text, price=$3::numeric, quantity=$4::numeric WHERE id=$1::numeric ORDER BY id ASC", values).then(result=>{
            res.status(200);
            res.json(item);
        }).catch(error=>{
            console.log(error);
            res.sendStatus(500);
        });
    }
});
cart.delete("/:id", (req,res)=>{
    pool.query("DELETE FROM shopping_cart WHERE id=$1::numeric", [req.data.id]).then(()=>{
        res.sendStatus(204);
        }).catch(error=>{
            console.log(error);
            res.sendStatus(500);
        });
});

module.exports = cart;