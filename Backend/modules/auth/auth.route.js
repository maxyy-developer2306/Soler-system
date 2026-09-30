import express from "express"
import { Registeration, login } from "./auth.controller.js"


let route = express.Router()


route.post("/register", Registeration)
route.post("/login", login)



export default route