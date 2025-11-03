import express from "express";
import axios from "axios";
import Search from "../models/Search.js";
import { isAuthenticated } from "./auth.js";

const router = express.Router();

// Get top 5 searches across all users
router.get("/top-searches", async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      {
        $group: {
          _id: "$term",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          term: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(topSearches);
  } catch (err) {
    console.error("Error fetching top searches:", err);
    res.status(500).json({ message: "Error fetching top searches" });
  }
});

// Search images (authenticated users only)
router.post("/search", isAuthenticated, async (req, res) => {
  try {
    const { term } = req.body;

    if (!term || term.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Save search to database
    await Search.create({
      userId: req.user._id,
      term: term.trim()
    });

    // Fetch images from Unsplash
    const response = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query: term,
          per_page: 20,
          client_id: process.env.UNSPLASH_ACCESS_KEY
        }
      }
    );

    const images = response.data.results.map((img) => ({
  id: img.id,
  url: img.urls?.raw
    ? `${img.urls.raw}&w=1080&q=90&auto=format`
    : img.urls?.regular || "",   // fallback if raw missing
  thumb: img.urls?.thumb || "",
  description: img.description || img.alt_description || "No description",
  photographer: img.user?.name || "Unknown",
  photographerUrl: img.user?.links?.html || "#",
}));


    res.json({
      term,
      total: response.data.total,
      results: images
    });
  } catch (err) {
    console.error("Error searching images:", err);
    res.status(500).json({ 
      message: "Error searching images",
      error: err.response?.data?.errors?.[0] || err.message 
    });
  }
});

export default router;
