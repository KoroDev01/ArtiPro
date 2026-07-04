const router = require("express").Router();
const {
  createPost,
  getPostList,
  getPostById,
  deletePost,
  completePost,
} = require("../controllers/post.controller");
const {
  isAuthenticated,
  isNotBanned,
} = require("../config/security.config");
const { uploadPost } = require("../config/upload.config");

router.put(
  "/:postId/complete",
  isAuthenticated,
  isNotBanned,
  completePost,
);
router.post("/", isAuthenticated, isNotBanned, uploadPost, createPost);
router.get("/list", getPostList);
router.get("/:postId", getPostById);
router.delete("/:postId", isAuthenticated, isNotBanned, deletePost);

module.exports = router;
