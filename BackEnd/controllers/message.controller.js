const Message = require("../database/models/message.model");
const Post = require("../database/models/post.model");
const Offer = require("../database/models/offer.model");
const User = require("../database/models/user.model");
const { createNotification } = require("./notification.controller");

exports.sendMessage = async (req, res) => {
  try {
    const { postId, receiverId, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isClient = post.client.toString() === req.user._id.toString();
    const proOffer =
      req.user.role === "pro"
        ? await Offer.findOne({ post: postId, pro: req.user._id })
        : null;

    if (!isClient && !proOffer) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      post: postId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    await createNotification({
      recipient: receiverId,
      type: "new_message",
      message: `Nouveau message de ${req.user.firstName} : "${content.slice(0, 50)}${content.length > 50 ? "…" : ""}"`,
      link: `/messages`,
    });

    res.status(201).json(message);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getMessagesByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isClient = post.client.toString() === req.user._id.toString();
    const proOffer =
      req.user.role === "pro"
        ? await Offer.findOne({ post: req.params.postId, pro: req.user._id })
        : null;

    if (!isClient && !proOffer) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ post: req.params.postId })
      .populate("sender", "firstName role")
      .populate("receiver", "firstName role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
