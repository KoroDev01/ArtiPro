const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri?.trim()) {
    throw new Error("MONGO_URI est manquant.");
  }

  try {
    await mongoose.connect(uri);
    console.log("Serveur mongodb connecté avec succès");
    return mongoose.connection;
  } catch (err) {
    if (
      err.code === 8000 ||
      err.codeName === "AtlasError" ||
      /bad auth/i.test(err.message)
    ) {
      console.error("\n❌ MongoDB : authentification échouée (bad auth)");
      console.error("1. Atlas → Database Access → Edit user → Reset Password");
      console.error(
        "2. Atlas → Connect → Drivers → copiez l'URI complète",
      );
      console.error("3. Railway → MONGO_URI → collez la nouvelle URI");
      console.error(
        "   (mot de passe sans @ — ou encodez @ en %40)\n",
      );
    }
    throw err;
  }
};

exports.clientPromise = mongoose.connection.asPromise();
