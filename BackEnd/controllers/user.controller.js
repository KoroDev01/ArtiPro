const { createUserQuerie } = require("../queries/user.queries.js");
const User = require("../database/models/user.model");

const handleError = (res, e) => res.status(400).json({ error: e.message });

const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true }).select("-password");

exports.userCreate = async (req, res, next) => {
  try {
    const user = await createUserQuerie(req.body);
    req.login(user, (err) =>
      err
        ? next(err)
        : res.status(201).json({ message: "User created successfully", user }),
    );
  } catch (e) {
    handleError(res, e);
  }
};

exports.userNew = (req, res) =>
  res.status(200).json({ message: "User creation form" });

exports.getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Non connecté" });
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("categories", "name");
    res.json(user);
  } catch (e) {
    handleError(res, e);
  }
};

exports.getProById = async (req, res) => {
  try {
    const user = await User.findById(req.params.proId)
      .select("-password")
      .populate("categories", "name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    handleError(res, e);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("categories", "name");
    res.json(users);
  } catch (e) {
    handleError(res, e);
  }
};

exports.searchPros = async (req, res) => {
  try {
    const { category, city, available } = req.query;
    const filter = { role: "pro" };
    if (category) filter.categories = category;
    if (city) filter["location.city"] = city;
    if (available === "true") filter.availability = true;
    const pros = await User.find(filter)
      .populate("categories", "name")
      .select("-password");
    res.json(pros);
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "firstName",
      "lastName",
      "phone",
      "description",
      "companyName",
      "siret",
      "experienceYears",
      "availability",
    ];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (req.body.city !== undefined) updates.location = { city: req.body.city };
    if (req.user.role === "pro" && Array.isArray(req.body.categories))
      updates.categories = req.body.categories;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true },
    )
      .select("-password")
      .populate("categories", "name");
    res.json(user);
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.user._id);
    user.avatar = `/images/avatars/${req.file.filename}`;
    await user.save();
    res.json({
      message: "Avatar updated",
      user: { id: user._id, avatar: user.avatar },
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.assignCategoriesToPro = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "pro")
      return res
        .status(400)
        .json({ message: "Only PRO users can have categories" });
    user.categories = req.body.categories;
    await user.save();
    res.json({ message: "Categories assigned successfully", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.removeCategoryFromPro = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "pro")
      return res
        .status(400)
        .json({ message: "Only PRO users can have categories" });
    user.categories = user.categories.filter(
      (c) => c.toString() !== req.body.categoryId,
    );
    await user.save();
    res.json({ message: "Category removed successfully", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.banUser = async (req, res) => {
  try {
    const durations = {
      "30min": 30 * 60 * 1000,
      "1day": 24 * 60 * 60 * 1000,
      "1week": 7 * 24 * 60 * 60 * 1000,
      "2weeks": 14 * 24 * 60 * 60 * 1000,
    };
    const banUntil =
      req.body.duration === "permanent"
        ? null
        : new Date(Date.now() + durations[req.body.duration]);
    const user = await updateUser(req.params.id, { isBlocked: true, banUntil });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User banned", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, {
      isBlocked: false,
      banUntil: null,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unbanned", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.approvePro = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, { proStatus: "approved" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Pro approved", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.rejectPro = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, {
      proStatus: "rejected",
      proRejectionReason: req.body.reason || "Candidature refusée.",
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Pro rejected", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, { isVerified: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User verified", user });
  } catch (e) {
    handleError(res, e);
  }
};

exports.unverifyUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, { isVerified: false });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unverified", user });
  } catch (e) {
    handleError(res, e);
  }
};
