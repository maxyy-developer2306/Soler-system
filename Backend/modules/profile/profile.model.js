
import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    }
}, { timestamps: true })

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        trim: true,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    postalCode: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["", "Male", "Female", "Other"],
        default: ""
    },
    occupation: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxlength: 2000,
        default: ""
    },
    reviews: {
        type: [reviewSchema],
        default: []
    }
}, {
    timestamps: true
})

const profileModel = mongoose.model("Profile", profileSchema)

export default profileModel
