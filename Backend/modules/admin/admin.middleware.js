
import jwt from "jsonwebtoken"

export function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies?.["Soler-system"]

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const decoded = jwt.verify(token, "maxyy")

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Admin access only"
      })
    }

    req.adminId = decoded.id
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired login"
    })
  }
}
