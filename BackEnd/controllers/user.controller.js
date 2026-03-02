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
      .populate("categories","name")
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

    // Retirer la catégorie
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