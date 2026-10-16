import historyModel from "../History/historyModel.js"
import orderModel from "../order/orderModel.js"
import productModel from "./productModel.js"

export async function deleteProductAndRelatedData(product) {
  const orders = await orderModel
    .find({ productId: product._id })
    .select("_id userId sellerId productTitle quantity totalAmount status")
    .lean()

  const historyFilters = [
    { productId: product._id },
    {
      type: "Product",
      userId: product.sellerId,
      productId: { $exists: false },
      message: {
        $in: [
          `Product "${product.title}" added successfully`,
          `Product "${product.title}" updated successfully`,
          `Product "${product.title}" deleted successfully`,
        ],
      },
    },
  ]

  for (const order of orders) {
    historyFilters.push({ orderId: order._id })
    historyFilters.push({
      userId: order.userId,
      type: "Order",
      orderId: { $exists: false },
      message: `You placed an order for ${order.productTitle}. Quantity: ${order.quantity}, Total: Rs. ${order.totalAmount}`,
    })
    historyFilters.push({
      userId: order.sellerId,
      type: "Order",
      orderId: { $exists: false },
      message: `New order received for your product: ${order.productTitle}. Quantity: ${order.quantity}, Total: Rs. ${order.totalAmount}`,
    })

    if (order.status === "Confirmed") {
      historyFilters.push({
        userId: order.userId,
        type: "Order",
        orderId: { $exists: false },
        message: `Your order for ${order.productTitle} is now Confirmed`,
      })
    }
  }

  await historyModel.deleteMany({ $or: historyFilters })
  await orderModel.deleteMany({ productId: product._id })
  await productModel.deleteOne({ _id: product._id })
}