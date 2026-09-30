import express from "express"
import cors from "cors"
import dbConection from "./shared/db/dbConection.js"
import userRoute from "./modules/auth/auth.route.js"
import dotenv from "dotenv"
dotenv.config()
dbConection()

let app = express()

app.use(express.json())
app.use(cors({
   origin: process.env.Frontend_Url,
    credentials: true
    
}))

app.use("/user", userRoute)


app.listen(4000, function(){
    console.log("The server is running")
})