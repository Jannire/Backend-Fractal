const express = require('express')
const app = express()
const { Order, productOrder, Product } = require("./DAO")

const port = 3000

app.get('/Orders', async (req, res) => {
  const all_orders = await Order.findAll();
  res.send(all_orders);
})

app.get('/Products', async (req, res) => {
  const all_products = await Product.findAll();
  res.send(all_products);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})