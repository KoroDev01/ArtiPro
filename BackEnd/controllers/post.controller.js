const Post = require("../database/models/post.model");
const User = require("../database/models/user.model");

exports.createPost = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only clients can create posts",
      });
    }

    const post = await Post.create({
      ...req.body,
      client: req.user._id,
    });

    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
