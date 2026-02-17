const express = require("express");
require("./database");
const router = require("./routes/index");
const app = express();

exports.app = app;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router)

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
