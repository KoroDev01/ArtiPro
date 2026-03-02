const router = require("express").Router();
const {
  userCreate,
  userNew,
  assignCategoriesToPro,
  removeCategoryFromPro,
  searchPros,
  getAllUsers,
} = require("../controllers/user.controller.js");

const { isAuthenticated, hasRole } = require("../config/security.config");
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
  hasRole("admin"), // ou autoriser le pro lui-même
  removeCategoryFromPro,
);
router.get("/pros/search", searchPros);

module.exports = router;
