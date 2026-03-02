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
exports.completePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Vérifier que c’est le client
    if (post.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the client can complete this post",
      });
    }

    // Vérifier le statut
    if (post.status !== "in_progress") {
      return res.status(400).json({
        message: "Post must be in progress to be completed",
      });
    }

    post.status = "completed";
    await post.save();

    res.json({
      message: "Post marked as completed",
      post,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};