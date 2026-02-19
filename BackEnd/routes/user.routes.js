const router = require("express").Router();
const {
  userCreate,
  userNew,
  assignCategoriesToPro,
searchPros} = require("../controllers/user.controller.js");

const { isAuthenticated, hasRole } = require("../config/security.config");
router.post("/createUser", userCreate);
router.get("/users", userNew);
router.put(
  "/:id/categories",
  isAuthenticated,
  hasRole("admin"),
  assignCategoriesToPro,
);
router.get("/pros/search", searchPros);

module.exports = router;
