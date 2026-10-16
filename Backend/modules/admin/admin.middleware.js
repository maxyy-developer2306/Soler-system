
import jwt from "jsonwebtoken"
import authModel from "../auth/auth.model.js"
import { getJwtSecret } from "../../shared/auth/jwtSecret.js"

export async function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies?.["Soler-system"]

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const decoded = jwt.verify(token, getJwtSecret())
    const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

    if (!ownerEmail) {
      return res.status(503).json({
        success: false,
        msg: "Owner admin email is not configured"
      })
    }

    const admin = await authModel.findById(decoded.id).select("email role")

    if (
      !admin ||
      admin.role !== "admin" ||
      admin.email?.trim().toLowerCase() !== ownerEmail
    ) {
      return res.status(403).json({
        success: false,
        msg: "Owner access only"
      })
    }

    req.adminId = admin._id
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired login"
    })
  }
}
