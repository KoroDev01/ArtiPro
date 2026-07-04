require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { validateEnv, getCorsOrigins } = require("./config/env.config");

validateEnv();

require("./database");
const path = require("path");
const router = require("./routes/index");
const cors = require("cors");
const app = express();
app.set("trust proxy", 1);
exports.app = app;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

require("./config/session.config");
require("./config/passport.config");

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
