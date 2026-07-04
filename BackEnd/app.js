require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const { validateEnv, corsOriginCheck } = require("./config/env.config");
const { connectDatabase } = require("./database");
const router = require("./routes/index");

validateEnv();

const app = express();
app.set("trust proxy", 1);
exports.app = app;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

async function start() {
  try {
    await connectDatabase();

    require("./config/session.config");
    require("./config/passport.config");
    const { resolveUserFromToken } = require("./middleware/auth.middleware");
    app.use(resolveUserFromToken);

    app.use(router);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("[FATAL]", err.message);
    process.exit(1);
  }
}

start();
