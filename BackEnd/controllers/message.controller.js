const Message = require("../database/models/message.model");
const Post = require("../database/models/post.model");
const Offer = require("../database/models/offer.model");
const User = require("../database/models/user.model");
const { createNotification } = require("./notification.controller");

exports.sendMessage = async (req, res) => {
  try {
    const { postId, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const senderId = req.user._id.toString();
    const isClient = post.client.toString() === senderId;
    const proOffer =
      req.user.role === "pro"
        ? await Offer.findOne({ post: postId, pro: req.user._id })
        : null;

    if (!isClient && !proOffer) {
      return res.status(403).json({ message: "Not allowed" });
    }

    let receiverId;
    if (isClient) {
      const proId = req.body.receiverId;
      if (!proId) {
        return res.status(400).json({ message: "Destinataire requis." });
      }
      const offer = await Offer.findOne({
        post: postId,
        client: req.user._id,
        pro: proId,
      });
      if (!offer) {
        return res.status(403).json({ message: "Not allowed" });
      }
      receiverId = offer.pro.toString();
    } else {
      receiverId = post.client.toString();
    }

    if (receiverId === senderId) {
      return res.status(400).json({ message: "Destinataire invalide." });
    }

    const message = await Message.create({
      post: postId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    const sender = await User.findById(req.user._id).select("firstName");

    await createNotification({
      recipient: receiverId,
      type: "new_message",
      message: `Nouveau message de ${sender?.firstName || "un utilisateur"} : "${content.slice(0, 50)}${content.length > 50 ? "…" : ""}"`,
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
      .populate("sender", "firstName lastName avatar role")
      .populate("receiver", "firstName lastName avatar role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
