
import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
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
    }
}, {
    timestamps: true
})

const profileModel = mongoose.model("Profile", profileSchema)

export default profileModel
