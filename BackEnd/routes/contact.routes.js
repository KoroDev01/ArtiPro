const { sendContact } = require("../controllers/contact.controller.js");
const { contactLimiter } = require("../config/rateLimit.config.js");
const router = require("express").Router();

router.post("/", contactLimiter, sendContact);

module.exports = router;
