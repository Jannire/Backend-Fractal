const express = require('express')
const { Op } = require("sequelize")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const { Order, productOrder, Product } = require("./dao")
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())
app.use(express.static("assets"))

app.get('/Orders', async (req, res) => {
  const all_orders = await Order.findAll();
  res.send(all_orders);
})

app.get('/Products', async (req, res) => {
  const all_products = await Product.findAll();
  res.send(all_products);
})

app.get("/Product", async (req, resp) => {
  const productID = req.query.productID
  const ProductSingle = await Product.findByPk(productID);
  resp.send(ProductSingle);
})

app.get("/Order/:id", async (req, resp) => {
  console.log(req.params.id);
  const orderID = req.params.id;
  const ord = await Order.findByPk(orderID);

  const listProdsOrd = await productOrder.findAll({
    where: {
      orderID: orderID
    }
  });
  const idsP = listProdsOrd.map((p) => p.productID);
  const listProducts = await Product.findAll({
    where: {
      productID: { 
        [Op.or]: idsP 
      }
    }
  })

  const resolve = { ...ord.dataValues, listProdsOrd, listProducts};
  resp.send(resolve);

})

app.post("/Order", async (req, res) => {
  const request = req.body;
  try {
    const data = await Order.create({
      orderNum: request.orderNum,
      orderDate: request.orderDate,
      numProducts: request.numProducts,
      finalPrice: request.finalPrice,
      orderStatus: "In Progress"
    })

    for (let index = 0; index < request.ids.length; index++) {
      await productOrder.create({
        orderID: data.orderID,
        productID: request.ids[index],
        Quantity: request.quants[index],
      })
    }
    res.send("Order created!");
  } catch (error) {
    console.log(error);
    res.send({
      error: `Error: ${error}`
    });
  }
})

app.put("/Order", async (req, resp) => {
  const request = req.body;
  const orderID = req.body.orderID;
  const updatedRows = await Order.update(request, { where: { orderID: orderID } });

  await productOrder.destroy({
    where: {
      orderID: orderID,
    },
  });

  for (let index = 0; index < request.ids.length; index++) {
    await productOrder.create({
      orderID: orderID,
      productID: request.ids[index],
      Quantity: request.quants[index],
    })
  }

  console.log(updatedRows);
  resp.send({
      error: ''
  })
})

app.delete("/Order", async (req, res) => {
  const request = req.body.orderID;

  await Order.destroy({
    where: {
      orderID: request
    }
  })
  res.send("Order deleted!");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})