
import profileModel from "./profile.model.js"
import authModel from "../auth/auth.model.js"
import orderModel from "../order/orderModel.js"
import productModel from "../products/productModel.js"
import cloudinary from "../../shared/config/cloudinary.js"
import jwt from "jsonwebtoken"

function getUserId(req) {
    const token = req.cookies?.["Soler-system"]

    if (!token) {
        return null
    }

    try {
        const decoded = jwt.verify(token, "maxyy")
        return decoded.id || decoded._id || decoded.userId || null
    } catch {
        return null
    }
}

async function uploadProfileImage(file) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "solar-seller-profiles" },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        ).end(file.buffer)
    })
}

export async function getProfile(req, res) {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return res.status(401).json({ success: false, msg: "Please login first" })
        }

        let profile = await profileModel.findOne({ userId })

        if (!profile) {
            profile = await profileModel.create({ userId })
        }

        const user = await authModel.findById(userId).select("name email role")

        return res.json({
            success: true,
            profile: {
                ...profile.toObject(),
                fullName: profile.fullName || user?.name || "",
                email: user?.email || "",
                role: user?.role || ""
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || "Profile could not be loaded"
        })
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return res.status(401).json({ success: false, msg: "Please login first" })
        }

        const allowedFields = [
            "fullName", "phone", "address", "city", "country", "postalCode",
            "dateOfBirth", "gender", "occupation", "company", "bio"
        ]
        const updates = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = String(req.body[field]).trim()
            }
        }

        if (req.file) {
            try {
                updates.image = await uploadProfileImage(req.file)
            } catch (uploadError) {
                console.log("Image upload failed, saving without image:", uploadError.message)
                // Image upload failed — still save text fields
            }
        } else if (typeof req.body.image === "string") {
            updates.image = req.body.image.trim()
        }

        let profile = await profileModel.findOneAndUpdate(
            { userId },
            { $set: updates },
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

export async function getSellerProfile(req, res) {
    try {
        const seller = await authModel.findById(req.params.sellerId).select("name role")
        if (!seller) {
            return res.status(404).json({ success: false, msg: "Seller not found" })
        }

        let profile = await profileModel.findOne({ userId: seller._id })
        if (!profile) profile = await profileModel.create({ userId: seller._id })
        profile = profile.toObject()
        const reviews = profile.reviews || []
        const products = await productModel
            .find({ sellerId: seller._id })
            .select("title image price company category quantity")
            .sort({ _id: -1 })
            .lean()

        let eligibleOrderId = ""
        const viewerId = getUserId(req)
        if (viewerId && String(viewerId) !== String(seller._id)) {
            const deliveredOrders = await orderModel
                .find({ userId: viewerId, sellerId: seller._id, status: "Delivered" })
                .select("_id")
                .sort({ createdAt: -1 })
                .lean()
            eligibleOrderId = deliveredOrders.find((order) =>
                !reviews.some((review) => String(review.orderId) === String(order._id))
            )?._id?.toString() || ""
        }

        const ratingAverage = reviews.length
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0

        return res.status(200).json({
            success: true,
            seller: {
                id: seller._id,
                name: profile?.fullName || seller.name,
                role: seller.role,
                profile: {
                    image: profile.image,
                    company: profile.company,
                    occupation: profile.occupation,
                    bio: profile.bio,
                    city: profile.city,
                    country: profile.country
                },
                products,
                reviews: [...reviews].sort((first, second) =>
                    new Date(second.createdAt) - new Date(first.createdAt)
                ),
                ratingAverage,
                reviewCount: reviews.length,
                eligibleOrderId
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || "Seller profile could not be loaded"
        })
    }
}

export async function addSellerReview(req, res) {
    try {
        const buyerId = getUserId(req)
        if (!buyerId) {
            return res.status(401).json({ success: false, msg: "Please login first" })
        }

        const rating = Number(req.body.rating)
        const comment = String(req.body.comment || "").trim()
        const { orderId } = req.body

        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length > 1000 || !orderId) {
            return res.status(400).json({ success: false, msg: "Choose a rating and enter a valid review" })
        }

        const order = await orderModel.findOne({
            _id: orderId,
            userId: buyerId,
            sellerId: req.params.sellerId,
            status: "Delivered"
        })
        if (!order) {
            return res.status(403).json({ success: false, msg: "Only buyers with a delivered order can review this seller" })
        }

        const buyer = await authModel.findById(buyerId).select("name")
        const profile = await profileModel.findOne({ userId: req.params.sellerId })
        if (!profile) {
            return res.status(404).json({ success: false, msg: "Seller profile is not available yet" })
        }

        if (profile.reviews.some((review) => String(review.orderId) === String(order._id))) {
            return res.status(409).json({ success: false, msg: "You have already reviewed this order" })
        }

        profile.reviews.push({
            buyerId,
            buyerName: buyer?.name || "Buyer",
            orderId: order._id,
            rating,
            comment
        })
        await profile.save()

        return res.status(201).json({
            success: true,
            msg: "Review submitted",
            review: profile.reviews[profile.reviews.length - 1]
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message || "Review could not be submitted" })
    }
}
