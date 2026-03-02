const router = require("express").Router();
const {
  sendMessage,
  getMessagesByPost,
} = require("../controllers/message.controller");

const { isAuthenticated } = require("../config/security.config");

router.post("/", isAuthenticated, sendMessage);
router.get("/post/:postId", isAuthenticated, getMessagesByPost);

module.exports = router;
