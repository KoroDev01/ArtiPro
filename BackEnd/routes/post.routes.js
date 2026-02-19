const router = require("express").Router();
const { createPost } = require("../controllers/post.controller");
const { isAuthenticated } = require("../config/security.config");

router.post("/", isAuthenticated, createPost);

module.exports = router;
