const fs = require("fs");

class Product {
  id;

  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  productId = 1;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(product) {
    try {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(fileData);

      const exists = products.find((x) => x.code == product.code);
      if (exists != null) {
        throw new Error(
          `El producto con el código ${product.code} ya fue ingresado`
        );
      }

      product.id = this.productId;
      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      this.productId += 1;
    } catch (error) {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([product], null, 2)
      );
      this.productId = 2;
    }
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const found = products.find((x) => x.id == id);
    if (found == null) {
      throw new Error(`No existe un producto con el id ${id}`);
    }
    return found;
  }

  async updateProduct(id, updatedProduct) {
    const products = await this.getProducts();

    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error(`No existe un producto con el id ${id}`);
    }

    products[index] = {
      ...products[index],
      ...updatedProduct,
      id,
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error(`No existe un producto con el id ${id}`);
    }
    products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;
