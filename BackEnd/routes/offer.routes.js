const router = require("express").Router();
const {
  createOffer,
  getOffersByPost,
  acceptOffer,
} = require("../controllers/offer.controller");

const { isAuthenticated } = require("../config/security.config");

router.post("/", isAuthenticated, createOffer);
router.get("/post/:postId", isAuthenticated, getOffersByPost);
router.put("/:offerId/accept", isAuthenticated, acceptOffer);

module.exports = router;
