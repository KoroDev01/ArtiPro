const router = require("express").Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "artipro-api" });
});

router.get("/", (req, res) => {
  res.status(200).json({
    service: "ArtiPro API",
    status: "running",
    hint: "Le site web est sur votre domaine Vercel. Endpoints : /health, /categories",
  });
});

module.exports = router;
