const {
  sessionNew,
  sessionCreate,
  sessionDelete,
  verifyEmail,
  resendCode,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");
const { authLimiter } = require("../config/rateLimit.config.js");
const router = require("express").Router();

router.get("/signin/form", sessionNew);
router.post("/signin", authLimiter, sessionCreate);
router.get("/signout", sessionDelete);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-code", authLimiter, resendCode);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
module.exports = router;
