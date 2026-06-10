const router = require("express").Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");
const { isAuthenticated } = require("../config/security.config");

router.get("/", isAuthenticated, getMyNotifications);
router.put("/read-all", isAuthenticated, markAllAsRead);
router.put("/:id/read", isAuthenticated, markAsRead);

module.exports = router;
