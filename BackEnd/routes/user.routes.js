const router = require("express").Router();
const {userNew} = require("../controllers/user.controller");
router.get("/", userNew);

module.exports = router;