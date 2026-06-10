const router = require("express").Router();
const {
  createReview,
  getReviewsByPro,
  getReviewByPost,
} = require("../controllers/review.controller");
const { isAuthenticated } = require("../config/security.config");

router.post("/", isAuthenticated, createReview);
router.get("/pro/:proId", getReviewsByPro);
router.get("/post/:postId", isAuthenticated, getReviewByPost);
module.exports = router;
