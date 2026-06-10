const express = require("express");
require("./database");
const path = require("path");
const router = require("./routes/index");
const cors = require("cors");
const app = express();

exports.app = app;
require("./config/session.config");
require("./config/passport.config");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
