
import historyModel from "./historyModel.js"
import jwt from "jsonwebtoken"

function getUserId(req) {
  const token = req.cookies?.["Soler-system"]

  if (!token) {
    return null
  }

  const decoded = jwt.verify(token, "maxyy")

  return decoded.id || decoded._id || decoded.userId
}

export async function addHistory(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const { type, message } = req.body

    if (!["Product", "Calculation", "Order"].includes(type) || !message) {
      return res.status(400).json({
        success: false,
        msg: "Valid type and message are required"
      })
    }

    const history = await historyModel.create({
      userId,
      type,
      message
    })

    res.status(201).json({
      success: true,
      msg: "History saved successfully",
      history
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}

export async function getHistory(req, res) {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    const history = await historyModel
      .find({ userId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      history
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    })
  }
}
