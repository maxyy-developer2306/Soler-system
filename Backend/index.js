import express from "express"
import cors from "cors"
import dbConection from "./shared/db/dbConection.js"
import userRoute from "./modules/auth/auth.route.js"
import productRoute from "./modules/products/product.route.js"
import historyRoute from "./modules/History/historyRoute.js"
import orderRoute from "./modules/order/orderRoute.js"
import adminRoutes from "./modules/admin/admin.routes.js"

import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

const allowedOrigins = [
  "https://soler-system-j2sf.vercel.app",
  "http://localhost:5173",
  ...(process.env.Frontend_Url ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
]

let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

async function requireDatabase(req, res, next) {
  try {
    await dbConection()
    next()
  } catch (error) {
    console.error("Database connection error:", error.message)
    res.status(503).json({
      success: false,
      msg: "Database is temporarily unavailable",
    })
  }
}

app.use("/user", requireDatabase, userRoute)
app.use("/api/products", requireDatabase, productRoute)
app.use("/api/history", requireDatabase, historyRoute)
app.use("/api/admin", requireDatabase, adminRoutes)
// app.use("/api/profile", profileRoute)
app.use("/api/orders", requireDatabase, orderRoute)


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Solar System Backend Deployed Successfully"
  })
})


app.listen(4000, function(){
    console.log("The server is running")
})



