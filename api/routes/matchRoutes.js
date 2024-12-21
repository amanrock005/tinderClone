import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  swipteLeft,
  swipeRight,
  getMatches,
  getUserProfile,
} from "../controllers/matchController.js";
const router = express.Router();

router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);
router.post("/swipe-left/:dislikedUserId", protectRoute, swipteLeft);
router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfile);

export default router;
