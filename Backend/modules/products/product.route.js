
import express from "express"
import upload from "../../shared/middleware/multer.js"

import {
  createProduct,
  getAllproducts,
  editProduct,
  deleteProduct,
  getProductById,
  getMyProducts
} from "./product.controller.js"

const route = express.Router()

route.post("/create", upload.single("image"), createProduct)

route.get("/products", getAllproducts)

route.get("/my-products", getMyProducts)

route.put("/edit/:id", upload.single("image"), editProduct)

route.delete("/delete/:id", deleteProduct)

route.get("/:id", getProductById)

export default route
