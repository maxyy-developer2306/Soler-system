
import express from "express"
import { verifyAdmin } from "./admin.middleware.js"

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminProducts,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus
} from "./admin.controller.js"

const router = express.Router()

router.use(verifyAdmin)

router.get("/dashboard", getAdminDashboard)
router.get("/users", getAdminUsers)

router.get("/products", getAdminProducts)
router.delete("/products/:id", deleteAdminProduct)

router.get("/orders", getAdminOrders)
router.patch("/orders/:id/status", updateAdminOrderStatus)

export default router
