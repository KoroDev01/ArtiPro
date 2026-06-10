const router = require("express").Router();
const {
  createPost,
  getPostList,
  getPostById,
  deletePost,
  completePost,
} = require("../controllers/post.controller");
const { isAuthenticated } = require("../config/security.config");
const { uploadPost } = require("../config/multer.config");

router.put("/:postId/complete", isAuthenticated, completePost);
router.post("/", isAuthenticated, uploadPost.array("photos", 3), createPost);
router.get("/list", getPostList);
router.get("/:postId", getPostById);
router.delete("/:postId", isAuthenticated, deletePost);

module.exports = router;
