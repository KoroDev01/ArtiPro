const router = require("express").Router();
const userRoute = require("./user.routes");

router.use("/", userRoute);


module.exports = router;