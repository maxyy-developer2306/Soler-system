
import authModel from "../auth/auth.model.js"
import productModel from "../products/productModel.js"
import orderModel from "../order/orderModel.js"
import historyModel from "../History/historyModel.js"
import { deleteProductAndRelatedData } from "../products/productCleanup.js"

export async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      orders
    ] = await Promise.all([
      authModel.countDocuments({ role: { $ne: "admin" } }),
      productModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.countDocuments({ status: "Pending" }),
      productModel.countDocuments({ quantity: { $lte: 5 } }),
      orderModel.find().select("totalAmount status").lean()
    ])

    const totalSales = orders
      .filter(order => order.status !== "Cancelled")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        lowStockProducts,
        totalSales
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function getAdminUsers(req, res) {
  try {
    const users = await authModel
      .find()
      .select("-password")
      .sort({ _id: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function getAdminProducts(req, res) {
  try {
    const products = await productModel
      .find()
      .sort({ _id: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function deleteAdminProduct(req, res) {
  try {
    const product = await productModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      })
    }

    await deleteProductAndRelatedData(product)

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function getAdminOrders(req, res) {
  try {
    const orders = await orderModel
      .find()
      .sort({ _id: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      orders
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function updateAdminOrderStatus(req, res) {
  try {
    const { status } = req.body
    const allowedTransitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: []
    }

    if (!Object.hasOwn(allowedTransitions, status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid order status"
      })
    }

    const order = await orderModel.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found"
      })
    }

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: `Cannot change order status from ${order.status} to ${status}`
      })
    }

    let stockRestored = false
    if (status === "Cancelled") {
      const stockUpdate = await productModel.updateOne(
        { _id: order.productId },
        { $inc: { quantity: order.quantity } }
      )

      if (stockUpdate.matchedCount === 0) {
        return res.status(409).json({
          success: false,
          msg: "Product stock could not be restored"
        })
      }
      stockRestored = true
    }

    const previousStatus = order.status
    order.status = status
    try {
      await order.save()
    } catch (error) {
      if (stockRestored) {
        await productModel.updateOne(
          { _id: order.productId },
          { $inc: { quantity: -order.quantity } }
        )
      }
      throw error
    }

    try {
      await historyModel.create([
        {
          userId: order.userId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: `Your order for ${order.productTitle} changed from ${previousStatus} to ${status}`
        },
        {
          userId: order.sellerId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: `Order for ${order.productTitle} changed from ${previousStatus} to ${status}`
        }
      ])
    } catch (historyError) {
      console.error("Admin order history error:", historyError)
    }

    return res.status(200).json({
      success: true,
      msg: "Order status updated successfully",
      order
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}
