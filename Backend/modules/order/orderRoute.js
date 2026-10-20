import express from "express";
import {
  createOrder,
  getMyOrders,
  getCustomerOrders,
  removeCustomerPurchase,
  updateOrderStatus,
  getOrderMessages,
  sendOrderMessage,
  getAllOrders
} from "./orderController.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/my-orders", getMyOrders);

router.get("/customer-orders", getCustomerOrders);

router.delete("/:id/purchase", removeCustomerPurchase);

router.get("/:id/messages", getOrderMessages);

router.post("/:id/messages", sendOrderMessage);

router.patch("/:id/status", updateOrderStatus);

router.get("/all", getAllOrders);

export default router;