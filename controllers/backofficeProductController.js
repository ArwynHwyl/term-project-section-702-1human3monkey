const path = require("path");
const fs = require("fs");

function createBackofficeProductController(productModel, categoryModel) {
  async function getProducts(req, res) {
    try {
      const products = await productModel.getProducts();
      res.render("pages/backoffice-product-page", {
        products,
        activePage: "products",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting the products" });
    }
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

    if (
      !name ||
      !description ||
      !category ||
      !normalPrice ||
      !discountPercent ||
      !image
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = path.join("/uploads", image.filename);

    try {
      const productId = await productModel.addProduct(
        name,
        description,
        category,
        normalPrice,
        discountPercent,
        imagePath
      );

      const attributes = JSON.parse(req.body.attributes);
      await productModel.addProductAttribute(productId, attributes);

      return res.status(201).json({
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

  async function deleteProductById(req, res) {
    const productId = req.params.productId;

    try {
      const product = await productModel.getProductById(productId);
      const imagePath = path.join("public", product.image_path);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await productModel.deleteProductById(productId);

      return res
        .status(200)
        .json({
          message: "Product deleted successfully",
          redirect: "/backoffice/product",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the product" });
    }
  }

  return {
    getProducts,
    renderAddProductPage,
    addProduct,
    deleteProductById
  };
}

module.exports = createBackofficeProductController;
