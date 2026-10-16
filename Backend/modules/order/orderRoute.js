import express from "express";
import {
  createOrder,
  getMyOrders,
  getCustomerOrders,
  updateOrderStatus,
  getAllOrders
} from "./orderController.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/my-orders", getMyOrders);

router.get("/customer-orders", getCustomerOrders);

router.patch("/:id/status", updateOrderStatus);

router.get("/all", getAllOrders);

export default router;