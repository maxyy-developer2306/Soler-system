
import express from "express"
import {
  addHistory,
  getHistory
} from "./historyController.js"

const router = express.Router()

router.post("/add", addHistory)
router.get("/", getHistory)

export default router
