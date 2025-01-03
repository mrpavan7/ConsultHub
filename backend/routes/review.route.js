import express from "express";
import {
  createReview,
  fetchReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/fetch-reviews", fetchReviews);

export default router;
