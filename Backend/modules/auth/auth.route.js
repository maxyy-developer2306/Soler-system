import express from "express"
import { Registeration, login, authCheck  } from "./auth.controller.js"


let route = express.Router()


route.post("/register", Registeration)
route.post("/login", login)
route.get("/check", authCheck)



export default route