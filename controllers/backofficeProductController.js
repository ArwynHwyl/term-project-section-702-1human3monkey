const path = require("path");
const fs = require("fs");

function createBackofficeProductController(productModel, categoryModel) {
  async function getProducts(req, res) {
    const products = [
      { image: 'https://via.placeholder.com/50', productname: 'Hoodie', description: 'Vintage Washed Denim Hooded', category: 'Hood', normalPrice: '2,252.31 THB', discountPercent: '0%', stock: 'x 5000' },
      { image: 'https://via.placeholder.com/50', productname: 'Elephant Pant', description: 'Vintage Washed Elephant Pant', category: 'Pants', normalPrice: '0.000011 THB', discountPercent: '50%', stock: 'x 5000' }
    ];
    res.render('pages/backoffice-product-page', { products, activePage: 'products' });
  }

  async function renderAddProductPage(req, res) {
    try {
      const categories = await categoryModel.getCategories();
      res.render("pages/backoffice-addproduct-page", {
        categories,
        activePage: "products",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting the categories" });
    }
  }

  async function addProduct(req, res) {
    const name = req.body.productName;
    const description = req.body.productDescription;
    const category = req.body.productCategory;
    const normalPrice = req.body.productPrice;
    const discountPercent = req.body.productDiscount;
    const image = req.file;

    if (!name || !description || !category || !normalPrice || !discountPercent || !image) {
      return res
        .status(400)
        .json({ error: "All fields are required" });
    }

    const imagePath = path.join("/uploads", image.filename);

    try {
      await productModel.addProduct(name, description, category, normalPrice, discountPercent, imagePath);
      return res
        .status(201)
        .json({
          message: "Product added successfully",
          redirect: "/backoffice/product",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while adding the product" });
    }
  }

  return {
    getProducts,
    renderAddProductPage,
    addProduct,
  };
}

module.exports = createBackofficeProductController;