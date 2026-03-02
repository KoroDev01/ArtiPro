const router = require("express").Router();
const { createPost } = require("../controllers/post.controller");
const { isAuthenticated } = require("../config/security.config");
const { completePost } = require("../controllers/post.controller");


router.put("/:postId/complete", isAuthenticated, completePost);
router.post("/", isAuthenticated, createPost);

module.exports = router;
