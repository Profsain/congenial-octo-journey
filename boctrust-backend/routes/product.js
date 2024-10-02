const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // import product model
const { default: axios } = require("axios");

// get all products endpoint
router.get("/products", async (req, res) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  try {
    // get all products
    let products = await Product.find();

    products = await Promise.all(
      products.map(async (product) => {
        const response = await axios.get(
          `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${product.productCode}`
        );

        return response.data;
      })
    );


    // return success response
    return res.status(200).json(products);
  } catch (error) {
    // console.log(error, "error");
    return res.status(500).json({ error: error.message });
  }
});

router.post("/products", (req, res) => {
  try {
    // Get post data from request body
    const { productCode } = req.body;

    // Validate required fields
    if (!productCode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new product
    const product = new Product(req.body);

    // Save product
    product.save();

    // Return success response
    return res.status(201).json({ success: "product created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single product endpoint
router.put("/products/:id", async (req, res) => {
  try {
    // get product id from request params
    const { id } = req.params;

    // get product update data from request body
    const { productCode } = req.body;

    // validate required fields
    if (!productCode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // find product by id and update
    const product = await Product.findByIdAndUpdate(id, {
      productCode,
    });

    // save updated product
    product.save();

    // return success response
    return res.status(200).json({ success: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single product endpoint
router.delete("/products/:id", async (req, res) => {
  try {
    // get product id from request params
    const { id } = req.params;

    // find post by id and delete
    await Product.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// export router
module.exports = router;
