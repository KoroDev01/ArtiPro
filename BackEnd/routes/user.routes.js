const router = require("express").Router();
const {
  userCreate,
  userNew,
  assignCategoriesToPro,
  removeCategoryFromPro,
  searchPros,
  getAllUsers,
  getCurrentUser,
  getProById,
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
  isAdmin,
  hasRole,
} = require("../config/security.config");
const { uploadAvatar } = require("../config/multer.config");

router.post("/createUser", userCreate);
router.get("/users", getAllUsers);
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
router.get("/pros/search", searchPros);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/me", isAuthenticated, updateProfile);
router.post(
  "/me/avatar",
  isAuthenticated,
  uploadAvatar.single("avatar"),
  updateAvatar,
);
router.get("/pro/:proId", getProById);
router.put("/users/:id/approve", isAuthenticated, isAdmin, approvePro);
router.put("/users/:id/reject", isAuthenticated, isAdmin, rejectPro);
router.put("/users/:id/ban", isAuthenticated, isAdmin, banUser);
router.put("/users/:id/unban", isAuthenticated, isAdmin, unbanUser);
router.put("/users/:id/verify", isAuthenticated, isAdmin, verifyUser);
router.put("/users/:id/unverify", isAuthenticated, isAdmin, unverifyUser);
module.exports = router;
