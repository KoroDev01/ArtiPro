const { createUserQuerie } = require("../queries/user.queries.js");
const User = require("../database/models/user.model");

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await createUserQuerie(body);
    console.log("User created:", user);
    req.login(user, (err) => {
      if (err) {
        next(err);
      } else {
        res.status(201).json({
          message: "User created successfully",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        });
      }
    });
  } catch (e) {
    res.status(400).json({
      message: "Error creating user",
      error: e.message,
    });
  }
};

exports.userNew = (req, res, next) => {
  try {
    res.status(200).json({
      message: "User creation form",
    });
  } catch (e) {
    res.status(400).json({
      message: "Error displaying user creation form",
      error: e.message,
    });
  }
};

exports.assignCategoriesToPro = async (req, res) => {
  try {
    const { categories } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "pro") {
      return res.status(400).json({
        message: "Only PRO users can have categories",
      });
    }

    user.categories = categories;
    await user.save();

    res.status(200).json({
      message: "Categories assigned successfully",
      user,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.searchPros = async (req, res) => {
  try {
    const { category, city, available } = req.query;

    let filter = {
      role: "pro",
    };

    if (category) {
      filter.categories = category;
    }

    if (city) {
      filter["location.city"] = city;
    }

    if (available === "true") {
      filter.availability = true;
    }

    const pros = await User.find(filter)
      .populate("categories", "name")
      .select("-password");

    res.status(200).json(pros);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.removeCategoryFromPro = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "pro") {
      return res.status(400).json({
        message: "Only PRO users can have categories",
      });
    }

    user.categories = user.categories.filter(
      (cat) => cat.toString() !== categoryId,
    );

    await user.save();

    res.status(200).json({
      message: "Category removed successfully",
      user,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("categories", "name");

    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    user.avatar = `/images/avatars/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Avatar updated",
      user: {
        id: user._id,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Non connecté" });
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("categories", "name");
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
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
    res.status(400).json({ error: e.message });
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
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.body.city !== undefined) {
      updates.location = { city: req.body.city };
    }

    if (req.user.role === "pro" && Array.isArray(req.body.categories)) {
      updates.categories = req.body.categories;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true },
    )
      .select("-password")
      .populate("categories", "name");

    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.banUser = async (req, res) => {
  try {
    const { duration } = req.body;
    const durations = {
      "30min": 30 * 60 * 1000,
      "1day": 24 * 60 * 60 * 1000,
      "1week": 7 * 24 * 60 * 60 * 1000,
      "2weeks": 14 * 24 * 60 * 60 * 1000,
    };
    const banUntil =
      duration === "permanent"
        ? null
        : new Date(Date.now() + durations[duration]);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true, banUntil },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User banned", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false, banUntil: null },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unbanned", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.approvePro = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { proStatus: "approved" },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Pro approved", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.rejectPro = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        proStatus: "rejected",
        proRejectionReason: reason || "Candidature refusée.",
      },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Pro rejected", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User verified", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.unverifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unverified", user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};