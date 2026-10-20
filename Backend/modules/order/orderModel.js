import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    // Seller who owns the product
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "auth"
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product"
    },

    productTitle: {
      type: String,
      required: true,
      trim: true
    },

    productImage: {
      type: String,
      default: ""
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number"
      }
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },

    hiddenForBuyer: {
      type: Boolean,
      default: false
    },

    messages: [{
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;