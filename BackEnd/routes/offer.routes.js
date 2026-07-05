const router = require("express").Router();
const {
  createOffer,
  getOffersByPost,
  acceptOffer,
  rejectOffer,
  getMyOffers,
} = require("../controllers/offer.controller");

const {
  isAuthenticated,
  isNotBanned,
} = require("../config/security.config");

router.post("/", isAuthenticated, isNotBanned, createOffer);
router.get("/post/:postId", isAuthenticated, getOffersByPost);
router.put("/:offerId/accept", isAuthenticated, isNotBanned, acceptOffer);
router.put("/:offerId/reject", isAuthenticated, isNotBanned, rejectOffer);
router.get("/mine", isAuthenticated, getMyOffers);
module.exports = router;
