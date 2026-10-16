
import profileModel from "./profile.model.js"
import jwt from "jsonwebtoken"
import { getJwtSecret } from "../../shared/auth/jwtSecret.js"

function getUserId(req) {
    let token = req.cookies?.["Soler-system"]

    if (!token) {
        throw new Error("Please login first")
    }

    let decoded = jwt.verify(token, getJwtSecret())
    return decoded.id || decoded._id || decoded.userId
}

export async function getProfile(req, res) {
    try {
        let userId = getUserId(req)

        let profile = await profileModel.findOne({ userId })

        if (!profile) {
            profile = await profileModel.create({ userId })
        }

        return res.json({
            success: true,
            profile
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: error.message
        })
    }
}

export async function updateProfile(req, res) {
    try {
        let userId = getUserId(req)
        let { phone, address, image } = req.body

        let profile = await profileModel.findOneAndUpdate(
            { userId },
            {
                $set: { phone, address, image }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        )

        return res.json({
            success: true,
            msg: "Profile updated successfully",
            profile
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}
