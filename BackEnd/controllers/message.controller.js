const Message = require("../database/models/message.model");
const Post = require("../database/models/post.model");

exports.sendMessage = async (req, res) => {
  try {
    const { postId, receiverId, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const message = await Message.create({
      post: postId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getMessagesByPost = async (req, res) => {
  try {
    const messages = await Message.find({
      post: req.params.postId,
    })
      .populate("sender", "firstName role")
      .populate("receiver", "firstName role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { postId, receiverId, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Vérifier que l'utilisateur est soit le client du post
    // soit un pro qui correspond à la catégorie
    const isClient = post.client.toString() === req.user._id.toString();

    const isMatchingPro =
      req.user.role === "pro" && req.user.categories.includes(post.category);

    if (!isClient && !isMatchingPro) {
      return res.status(403).json({
        message: "You are not allowed to send messages for this post",
      });
    }

    const message = await Message.create({
      post: postId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getMessagesByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isClient = post.client.toString() === req.user._id.toString();

    const isMatchingPro =
      req.user.role === "pro" && req.user.categories.includes(post.category);

    if (!isClient && !isMatchingPro) {
      return res.status(403).json({
        message: "You are not allowed to view this conversation",
      });
    }

    const messages = await Message.find({
      post: req.params.postId,
    })
      .populate("sender", "firstName role")
      .populate("receiver", "firstName role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};