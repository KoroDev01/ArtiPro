const router = require("express").Router();
const {
  listByPro,
  create,
  remove,
  toggleLike,
  listComments,
  addComment,
} = require("../controllers/portfolio.controller");
const { resolveUserFromToken } = require("../middleware/auth.middleware");
const {
  isAuthenticated,
  isNotBanned,
} = require("../config/security.config");
const { uploadPortfolio } = require("../config/upload.config");

router.use(resolveUserFromToken);

router.get("/pro/:proId", listByPro);
router.get("/:postId/comments", listComments);

router.post("/", isAuthenticated, isNotBanned, uploadPortfolio, create);
router.delete("/:postId", isAuthenticated, remove);
router.post("/:postId/like", isAuthenticated, isNotBanned, toggleLike);
router.post("/:postId/comments", isAuthenticated, isNotBanned, addComment);

module.exports = router;
