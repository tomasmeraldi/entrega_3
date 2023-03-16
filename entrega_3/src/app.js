const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const ProductManager = require("./ProductManager");
const productManager = new ProductManager("../productos.json");

app.get("/products", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, limit);
    }
    res.send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    res.send(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(8080, () => {
  console.log("¡Servidor arriba en el puerto 8080!");
});
