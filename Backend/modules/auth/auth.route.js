import express from "express"
import { Registeration, login, authCheck, logout } from "./auth.controller.js"


let route = express.Router()


route.post("/register", Registeration)
route.post("/login", login)
route.get("/check", authCheck)
route.post("/logout", logout)



export default route
