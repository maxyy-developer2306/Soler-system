
import express from "express"
import {
    getProfile,
    updateProfile,
    getSellerProfile,
    addSellerReview
} from "./profile.controller.js"
import upload from "../../shared/middleware/multer.js"

const router = express.Router()

router.get("/seller/:sellerId", getSellerProfile)
router.post("/seller/:sellerId/reviews", addSellerReview)
router.get("/", getProfile)
router.put("/update", upload.single("image"), updateProfile)

export default router
