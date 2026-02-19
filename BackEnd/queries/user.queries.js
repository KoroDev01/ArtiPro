const User = require("../database/models/user.model");
exports.createUserQuerie = async (body) => {
  try {
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({
      email: body.email,
      password: hashedPassword,
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    return user.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.findUserPerEmail = async (email) => {
  return User.findOne({ email }).select("+password").exec();


};
