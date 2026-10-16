
import express from "express"
import {
    getProfile,
    updateProfile
} from "./profile.controller.js"

const router = express.Router()

router.get("/", getProfile)
router.put("/update", updateProfile)

export default router
