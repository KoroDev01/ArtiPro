const router = require("express").Router();
const userRoute = require("./user.routes");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");

router.use("/", userRoute);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
