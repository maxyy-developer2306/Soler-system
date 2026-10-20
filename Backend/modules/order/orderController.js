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
  const reservedItems = [];
  const createdOrderIds = [];

  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    const { customerName, phone, address } = req.body;
    const items = Array.isArray(req.body.items)
      ? req.body.items
      : [{ productId: req.body.productId, quantity: req.body.quantity }];

    if (
      !customerName?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      items.length < 1 ||
      items.length > 30 ||
      items.some((item) =>
        !item ||
        !item.productId ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      )
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide valid order details"
      });
    }

    const requestedProducts = await Promise.all(
      items.map(async (item) => ({
        item,
        product: await productModel.findById(item.productId)
      }))
    );

    if (requestedProducts.some(({ product }) => !product)) {
      return res.status(404).json({
        success: false,
        msg: "Product not found"
      });
    }

    if (requestedProducts.some(({ product }) =>
      !Number.isFinite(Number(product.price)) || Number(product.price) <= 0
    )) {
      return res.status(400).json({
        success: false,
        msg: "Invalid product price"
      });
    }

    const orders = [];
    for (const { item, product } of requestedProducts) {
      const quantity = Number(item.quantity);
      const updatedProduct = await productModel.findOneAndUpdate(
        { _id: product._id, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        throw Object.assign(new Error("Not enough stock available"), {
          statusCode: 400
        });
      }

      reservedItems.push({ productId: product._id, quantity });

      const price = Number(product.price);
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
        quantity,
        totalAmount: price * quantity,
        status: "Pending"
      });

      orders.push(order);
      createdOrderIds.push(order._id);
    }

    try {
      const historyEntries = orders.flatMap((order) => [
        {
          userId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: `You placed an order for ${order.productTitle}. Quantity: ${order.quantity}, Total: Rs. ${order.totalAmount}`
        },
        {
          userId: order.sellerId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: `New order received for your product: ${order.productTitle}. Quantity: ${order.quantity}, Total: Rs. ${order.totalAmount}`
        }
      ]);
      await historyModel.create(historyEntries);
    } catch (historyError) {
      console.log("Order History Error:", historyError);
    }

    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      order: orders[0],
      orders
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    if (createdOrderIds.length > 0) {
      try {
        await orderModel.deleteMany({ _id: { $in: createdOrderIds } });
      } catch (deleteError) {
        console.log("Order Rollback Error:", deleteError);
      }
    }

    for (const item of reservedItems) {
      try {
        await productModel.updateOne(
          { _id: item.productId },
          { $inc: { quantity: item.quantity } }
        );
      } catch (restoreError) {
        console.log("Stock Restore Error:", restoreError);
      }
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      msg: error.statusCode ? error.message : "Unable to place order"
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

    res.set("Cache-Control", "private, no-store, max-age=0");

    const orders = await orderModel
      .find({ userId, hiddenForBuyer: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      ownerId: String(userId),
      orders
    });
  } catch (error) {
    console.log("Get Customer Orders Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to get your orders"
    });
  }
}

export async function removeCustomerPurchase(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, msg: "Please login first" });
    }

    const purchase = await orderModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { hiddenForBuyer: true } },
      { new: true, projection: { _id: 1 } }
    );

    if (!purchase) {
      return res.status(404).json({ success: false, msg: "Purchase not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Removed from My Purchases. The seller's order was not changed."
    });
  } catch (error) {
    console.log("Remove Customer Purchase Error:", error);
    return res.status(500).json({ success: false, msg: "Purchase could not be removed" });
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

    const nextStatus = req.body.status;
    const cancellationReason = String(req.body.cancellationReason || "").trim();

    if (!["Confirmed", "Shipped", "Delivered", "Cancelled"].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid order status"
      });
    }

    if (nextStatus === "Cancelled" && (!cancellationReason || cancellationReason.length > 500)) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a cancellation reason (up to 500 characters)"
      });
    }

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found"
      });
    }

    const isSeller = String(order.sellerId) === String(userId);
    const isCustomer = String(order.userId) === String(userId);

    if (!isSeller && !isCustomer) {
      return res.status(403).json({
        success: false,
        msg: "You can only manage your own orders"
      });
    }

    const allowedTransition =
      (isSeller && order.status === "Pending" && nextStatus === "Confirmed") ||
      (isSeller && order.status === "Confirmed" && nextStatus === "Shipped") ||
      (isSeller && order.status === "Shipped" && nextStatus === "Delivered") ||
      (isSeller && ["Pending", "Confirmed"].includes(order.status) && nextStatus === "Cancelled") ||
      (isCustomer && order.status === "Shipped" && nextStatus === "Delivered") ||
      (isCustomer && order.status === "Pending" && nextStatus === "Cancelled");

    if (!allowedTransition) {
      return res.status(400).json({
        success: false,
        msg: "This order cannot be moved to that status"
      });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: order._id, status: order.status },
      {
        $set: {
          status: nextStatus,
          ...(nextStatus === "Cancelled" ? { cancellationReason } : {})
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({
        success: false,
        msg: "This order was updated by someone else. Refresh and try again."
      });
    }

    if (nextStatus === "Cancelled") {
      await productModel.updateOne(
        { _id: order.productId },
        { $inc: { quantity: order.quantity } }
      );
    }

    try {
      const statusMessages = {
        Confirmed: {
          customer: `Your order for ${order.productTitle} was confirmed by the seller.`,
          seller: `You confirmed the order for ${order.productTitle}.`
        },
        Shipped: {
          customer: `Your order for ${order.productTitle} has been shipped.`,
          seller: `You marked the order for ${order.productTitle} as shipped.`
        },
        Delivered: {
          customer: `You confirmed delivery of ${order.productTitle}.`,
          seller: `The customer confirmed delivery of ${order.productTitle}.`
        },
        Cancelled: {
          customer: isCustomer
            ? `You cancelled the order for ${order.productTitle}. Reason: ${cancellationReason}`
            : `The seller cancelled the order for ${order.productTitle}. Reason: ${cancellationReason}`,
          seller: isSeller
            ? `You cancelled the order for ${order.productTitle}. Reason: ${cancellationReason}`
            : `The customer cancelled the order for ${order.productTitle}. Reason: ${cancellationReason}`
        }
      };

      await historyModel.create([
        {
          userId: order.userId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: statusMessages[nextStatus].customer
        },
        {
          userId: order.sellerId,
          productId: order.productId,
          orderId: order._id,
          type: "Order",
          message: statusMessages[nextStatus].seller
        }
      ]);
    } catch (historyError) {
      console.log("Order History Error:", historyError);
    }

    return res.status(200).json({
      success: true,
      msg: `Order ${nextStatus.toLowerCase()} successfully`,
      order: updatedOrder
    });
  } catch (error) {
    console.log("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to update order status"
    });
  }
}

export async function getOrderMessages(req, res) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Please login first" });
    }

    const order = await orderModel.findById(req.params.id).select("userId sellerId messages").lean();

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    if (![order.userId, order.sellerId].some((participantId) => String(participantId) === String(userId))) {
      return res.status(403).json({ success: false, msg: "You cannot access this order chat" });
    }

    const messages = (order.messages || []).map((message) => ({
      ...message,
      senderRole: String(message.senderId) === String(order.userId) ? "Buyer" : "Seller"
    }));

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Get Order Messages Error:", error);
    return res.status(500).json({ success: false, msg: "Unable to load order chat" });
  }
}

export async function sendOrderMessage(req, res) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Please login first" });
    }

    const message = String(req.body.message || "").trim();

    if (!message || message.length > 2000) {
      return res.status(400).json({ success: false, msg: "Message must be between 1 and 2000 characters" });
    }

    const order = await orderModel.findById(req.params.id).select("userId sellerId");

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    if (![order.userId, order.sellerId].some((participantId) => String(participantId) === String(userId))) {
      return res.status(403).json({ success: false, msg: "You cannot send messages to this order" });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: order._id },
      {
        $push: {
          messages: {
            $each: [{ senderId: userId, message }],
            $slice: -200
          }
        }
      },
      { new: true, projection: { messages: { $slice: -200 } } }
    );

    return res.status(201).json({
      success: true,
      message: {
        ...updatedOrder.messages.at(-1).toObject(),
        senderRole: String(userId) === String(order.userId) ? "Buyer" : "Seller"
      }
    });
  } catch (error) {
    console.log("Send Order Message Error:", error);
    return res.status(500).json({ success: false, msg: "Unable to send message" });
  }
}

// Returns the decoded JWT payload ({ id, role }) or null if not logged in
function getAuthUser(req) {
  try {
    const token = req.cookies?.["Soler-system"];
    if (!token) return null;
    return jwt.verify(token, "maxyy");
  } catch (error) {
    return null;
  }
}

// All orders across every user — restricted to admin only
export async function getAllOrders(req, res) {
  try {
    const user = getAuthUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      });
    }

    if (String(user.role) !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Only admin can view all orders"
      });
    }

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