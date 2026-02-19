const router = require("express").Router();
const {
  categoryCreate,
  categoryList,
  categoryShow,
  categoryUpdate,
  categoryDelete,
} = require("../controllers/category.controller");
const { isAuthenticated, isAdmin } = require("../config/security.config");
router.post("/", isAuthenticated, isAdmin, categoryCreate);
router.get("/", categoryList);
router.get("/:id", categoryShow);
router.put("/:id", isAuthenticated, isAdmin, categoryUpdate);
router.delete("/:id", isAuthenticated, isAdmin, categoryDelete);

module.exports = router;
