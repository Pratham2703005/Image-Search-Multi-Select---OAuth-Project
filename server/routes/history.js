import express from "express";
import Search from "../models/Search.js";
import { isAuthenticated } from "./auth.js";

const router = express.Router();

// Get user's search history
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .select("term timestamp -_id");

    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Error fetching search history" });
  }
});

export default router;
