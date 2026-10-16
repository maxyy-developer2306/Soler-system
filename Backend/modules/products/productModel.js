import mongoose from "mongoose"

let productSchema = mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    company: String,
    category: String,
    quantity: Number,

    sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true
}


})

let productModel = mongoose.model("product", productSchema)

export default productModel
