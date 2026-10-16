
import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  type: {
    type: String,
    enum: ["Product", "Calculation", "Order"],
    required: true
  },

  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const historyModel = mongoose.model("History", historySchema)

export default historyModel
