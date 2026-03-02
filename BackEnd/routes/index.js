const router = require("express").Router();
const userRoute = require("./user.routes");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const postRoutes = require("./post.routes");
const messageRoutes = require("./message.routes");
const offerRoutes = require("./offer.routes");


router.use("/offers", offerRoutes);
router.use("/messages", messageRoutes);
router.use("/", userRoute);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/posts", postRoutes);
module.exports = router;
