const User = require("../database/models/user.model");

const validatePassword = (pwd) => {
  if (!pwd || pwd.length < 8)
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  if (!/[0-9]/.test(pwd))
    throw new Error("Le mot de passe doit contenir au moins un chiffre.");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pwd))
    throw new Error(
      "Le mot de passe doit contenir au moins un caractère spécial.",
    );
};

exports.createUserQuerie = async (body) => {
  try {
    validatePassword(body.password);
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({
      email: body.email,
      password: hashedPassword,
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
      ...(body.role === "pro" && {
        proStatus: "pending",
        companyName: body.companyName,
        siret: body.siret,
        description: body.description,
        experienceYears: body.experienceYears,
      }),
    });

    return user.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.findUserPerEmail = async (email) => {
  return User.findOne({ email }).select("+password").exec();
};
