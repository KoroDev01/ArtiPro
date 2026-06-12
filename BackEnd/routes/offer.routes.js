const router = require("express").Router();
const {
  createOffer,
  getOffersByPost,
  acceptOffer,
  getMyOffers,
} = require("../controllers/offer.controller");

const {
  isAuthenticated,
  isNotBanned,
} = require("../config/security.config");

router.post("/", isAuthenticated, isNotBanned, createOffer);
router.get("/post/:postId", isAuthenticated, getOffersByPost);
router.put("/:offerId/accept", isAuthenticated, isNotBanned, acceptOffer);
router.get("/mine", isAuthenticated, getMyOffers);
module.exports = router;
