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
dbConection()

let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin: process.env.Frontend_Url,
    credentials: true
    
}))

app.use("/user", userRoute)
app.use("/api/products", productRoute)
app.use("/api/history", historyRoute)
app.use("/api/admin", adminRoutes)
// app.use("/api/profile", profileRoute)
app.use("/api/orders", orderRoute)
app.listen(4000, function(){
    console.log("The server is running")
})



