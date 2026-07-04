#!/usr/bin/env node
/**
 * Crée un compte administrateur.
 * Usage : node scripts/create-admin.js email@example.com MotDePasse123!
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../database/models/user.model");

const [email, password, firstName = "Admin", lastName = "ArtiPro"] =
  process.argv.slice(2);

if (!email || !password) {
  console.error(
    "Usage: node scripts/create-admin.js <email> <mot-de-passe> [prénom] [nom]",
  );
  process.exit(1);
}

async function main() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/ArtiPro",
  );

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    existing.proStatus = undefined;
    existing.password = await User.hashPassword(password);
    await existing.save();
    console.log(`✓ Compte existant promu admin : ${email}`);
  } else {
    const user = new User({
      email: email.toLowerCase(),
      password: await User.hashPassword(password),
      role: "admin",
      firstName,
      lastName,
      emailVerified: true,
    });
    await user.save();
    console.log(`✓ Admin créé : ${email}`);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
