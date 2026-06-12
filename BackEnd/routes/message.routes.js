const router = require("express").Router();
const {
  sendMessage,
  getMessagesByPost,
} = require("../controllers/message.controller");

const {
  isAuthenticated,
  isNotBanned,
} = require("../config/security.config");

router.post("/", isAuthenticated, isNotBanned, sendMessage);
router.get("/post/:postId", isAuthenticated, getMessagesByPost);

module.exports = router;
