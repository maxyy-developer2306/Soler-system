
import authModel from "../auth/auth.model.js"
import productModel from "../products/productModel.js"
import orderModel from "../order/orderModel.js"

export async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      orders
    ] = await Promise.all([
      authModel.countDocuments({ role: { $ne: "admin" } }),
      productModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.countDocuments({ status: "Pending" }),
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
    const product = await productModel.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      })
    }

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
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled"
    ]

    const { status } = req.body

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid order status"
      })
    }

    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found"
      })
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
