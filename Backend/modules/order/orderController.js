import orderModel from "./orderModel.js";
import productModel from "../products/productModel.js";
import historyModel from "../History/historyModel.js";
import jwt from "jsonwebtoken";

// Returns the logged in user's id, or null if the token is missing or invalid
function getUserId(req) {
  try {
    const token = req.cookies?.["Soler-system"];
    if (!token) return null;

    const decoded = jwt.verify(token, "maxyy");
    return decoded.id || decoded._id || decoded.userId || null;
  } catch (error) {
    // Invalid or expired token is treated as "not logged in"
    return null;
  }
}

export async function createOrder(req, res) {
  let productId;
  let orderQuantity;
  let stockUpdated = false;

  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    const { customerName, phone, address, quantity } = req.body;
    productId = req.body.productId;
    orderQuantity = Number(quantity);

    if (
      !productId ||
      !customerName?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !Number.isInteger(orderQuantity) ||
      orderQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide valid order details"
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      });
    }

    const price = Number(product.price);

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product price"
      });
    }

    // Reduce stock atomically only if enough stock is available
    const updatedProduct = await productModel.findOneAndUpdate(
      {
        _id: productId,
        quantity: { $gte: orderQuantity }
      },
      {
        $inc: { quantity: -orderQuantity }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        msg: "Not enough stock available"
      });
    }

    stockUpdated = true;

    const order = await orderModel.create({
      userId,
      sellerId: product.sellerId,
      productId: product._id,
      productTitle: product.title,
      productImage: product.image,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      price,
      quantity: orderQuantity,
      totalAmount: price * orderQuantity,
      status: "Pending"
    });

    // Order saved, so stock does not need to be restored anymore
    stockUpdated = false;

    try {
      await historyModel.create({
        userId,
        type: "Order",
        message: `You placed an order for ${product.title}. Quantity: ${orderQuantity}, Total: Rs. ${price * orderQuantity}`
      });

      await historyModel.create({
        userId: product.sellerId,
        type: "Order",
        message: `New order received for your product: ${product.title}. Quantity: ${orderQuantity}, Total: Rs. ${price * orderQuantity}`
      });
    } catch (historyError) {
      console.log("Order History Error:", historyError);
    }

    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      order
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    // If stock was reduced but the order failed, give the stock back
    if (stockUpdated && productId && orderQuantity) {
      try {
        await productModel.updateOne(
          { _id: productId },
          { $inc: { quantity: orderQuantity } }
        );
      } catch (restoreError) {
        console.log("Stock Restore Error:", restoreError);
      }
    }

    return res.status(500).json({
      success: false,
      msg: "Unable to place order"
    });
  }
}

// Orders received for the logged in seller's products
export async function getMyOrders(req, res) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    const orders = await orderModel
      .find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to get your orders"
    });
  }
}

// Orders placed by the logged in customer
export async function getCustomerOrders(req, res) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Get Customer Orders Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to get your orders"
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    if (req.body.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        msg: "Invalid order status"
      });
    }

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found"
      });
    }

    // Only the seller of the product can confirm the order
    if (String(order.sellerId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        msg: "You can only manage your own orders"
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        msg: "Only pending orders can be confirmed"
      });
    }

    order.status = "Confirmed";
    await order.save();

    try {
      await historyModel.create({
        userId: order.userId,
        type: "Order",
        message: `Your order for ${order.productTitle} is now Confirmed`
      });
    } catch (historyError) {
      console.log("Order History Error:", historyError);
    }

    return res.status(200).json({
      success: true,
      msg: "Order confirmed successfully",
      order
    });
  } catch (error) {
    console.log("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to update order status"
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to get all orders"
    });
  }
}