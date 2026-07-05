const router = require("express").Router();
const {
  userCreate,
  assignCategoriesToPro,
  removeCategoryFromPro,
  searchPros,
  getAllUsers,
  getCurrentUser,
  getProById,
  recordProfileView,
  updateProfile,
  updateAvatar,
  banUser,
  unbanUser,
  approvePro,
  rejectPro,
  verifyUser,
  unverifyUser,
} = require("../controllers/user.controller.js");

const {
  isAuthenticated,
  isNotBanned,
  isAdmin,
  hasRole,
} = require("../config/security.config");
const { uploadAvatar } = require("../config/upload.config");
const { registerLimiter } = require("../config/rateLimit.config");
const { resolveUserFromToken } = require("../middleware/auth.middleware");

router.post("/createUser", registerLimiter, userCreate);
router.get("/pros/search", searchPros);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/me", isAuthenticated, isNotBanned, updateProfile);
router.post("/me/avatar", isAuthenticated, uploadAvatar, updateAvatar);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/pro/:proId", getProById);
router.post("/pro/:proId/view", resolveUserFromToken, recordProfileView);
router.put(
  "/:id/categories",
  isAuthenticated,
  hasRole("admin"),
  assignCategoriesToPro,
);
router.put(
  "/:id/remove-category",
  isAuthenticated,
  hasRole("admin"),
  removeCategoryFromPro,
);
router.put("/users/:id/approve", isAuthenticated, isAdmin, approvePro);
router.put("/users/:id/reject", isAuthenticated, isAdmin, rejectPro);
router.put("/users/:id/ban", isAuthenticated, isAdmin, banUser);
router.put("/users/:id/unban", isAuthenticated, isAdmin, unbanUser);
router.put("/users/:id/verify", isAuthenticated, isAdmin, verifyUser);
router.put("/users/:id/unverify", isAuthenticated, isAdmin, unverifyUser);
module.exports = router;
