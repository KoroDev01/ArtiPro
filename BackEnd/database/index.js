const mongoose = require("mongoose");
require("dotenv").config();

exports.clientPromise = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Serveur mongodb connecté avec succès");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
