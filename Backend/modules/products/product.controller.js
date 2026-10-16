
import productModel from "./productModel.js"
import cloudinary from "../../shared/config/cloudinary.js"
import historyModel from "../History/historyModel.js"
import jwt from "jsonwebtoken"

function getUserId(req) {
  try {
    const token = req.cookies?.["Soler-system"]

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, "maxyy")
    return decoded.id || decoded._id || decoded.userId || null
  } catch (error) {
    return null
  }
}

export async function createProduct(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const {
      title,
      description,
      price,
      company,
      category,
      quantity
    } = req.body

    if (
      !title?.trim() ||
      !description?.trim() ||
      price === undefined ||
      price === "" ||
      !company?.trim() ||
      !category ||
      quantity === undefined ||
      quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all product fields"
      })
    }

    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        msg: "Price or quantity is invalid"
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "Please select a product image"
      })
    }

    const imageUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "solar-products" },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(req.file.buffer)
    })

    const product = await productModel.create({
      image: imageUpload.secure_url,
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      company: company.trim(),
      category,
      quantity: numericQuantity,
      sellerId: userId
    })

    try {
      await historyModel.create({
        userId,
        type: "Product",
        message: `Product "${product.title}" added successfully`
      })
    } catch (historyError) {
      console.log("Product History Error:", historyError)
    }

    return res.status(201).json({
      success: true,
      msg: "Product created successfully",
      product
    })
  } catch (error) {
    console.log("Create Product Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Product creation failed"
    })
  }
}

export async function getAllproducts(req, res) {
  try {
    const products = await productModel.find().sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      msg: "Products fetched successfully",
      products
    })
  } catch (error) {
    console.log("Get Products Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Unable to get products"
    })
  }
}

export async function getMyProducts(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const products = await productModel.find({
      sellerId: userId
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    console.log("Get My Products Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Unable to get your products"
    })
  }
}

export async function getProductById(req, res) {
  try {
    const product = await productModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      })
    }

    return res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    console.log("Get Product Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Unable to get product"
    })
  }
}

export async function editProduct(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const product = await productModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      })
    }

    if (String(product.sellerId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        msg: "You can only edit your own products"
      })
    }

    const {
      title,
      description,
      price,
      company,
      category,
      quantity
    } = req.body

    if (
      !title?.trim() ||
      !description?.trim() ||
      price === undefined ||
      price === "" ||
      !company?.trim() ||
      !category ||
      quantity === undefined ||
      quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all product fields"
      })
    }

    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        msg: "Price or quantity is invalid"
      })
    }

    product.title = title.trim()
    product.description = description.trim()
    product.price = numericPrice
    product.company = company.trim()
    product.category = category
    product.quantity = numericQuantity

    if (req.file) {
      const imageUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "solar-products" },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        ).end(req.file.buffer)
      })

      product.image = imageUpload.secure_url
    }

    await product.save()

    try {
      await historyModel.create({
        userId,
        type: "Product",
        message: `Product "${product.title}" updated successfully`
      })
    } catch (historyError) {
      console.log("Product History Error:", historyError)
    }

    return res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      product
    })
  } catch (error) {
    console.log("Edit Product Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Product not updated"
    })
  }
}

export async function deleteProduct(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const product = await productModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      })
    }

    if (String(product.sellerId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        msg: "You can only delete your own products"
      })
    }

    await productModel.findByIdAndDelete(req.params.id)

    try {
      await historyModel.create({
        userId,
        type: "Product",
        message: `Product "${product.title}" deleted successfully`
      })
    } catch (historyError) {
      console.log("Product History Error:", historyError)
    }

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully"
    })
  } catch (error) {
    console.log("Delete Product Error:", error)

    return res.status(500).json({
      success: false,
      msg: error.message || "Product not deleted"
    })
  }
}
