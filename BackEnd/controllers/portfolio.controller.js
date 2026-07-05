const PortfolioPost = require("../database/models/portfolioPost.model");
const PortfolioComment = require("../database/models/portfolioComment.model");
const { resolveUploadedFiles } = require("../config/upload.config");

const handleError = (res, e) => res.status(400).json({ error: e.message });

const formatPost = async (post, userId) => {
  const obj = post.toObject ? post.toObject() : { ...post };
  const commentCount = await PortfolioComment.countDocuments({ post: obj._id });
  return {
    ...obj,
    likeCount: obj.likes?.length ?? 0,
    likedByMe: userId
      ? (obj.likes || []).some((id) => id.toString() === userId.toString())
      : false,
    commentCount,
  };
};

exports.listByPro = async (req, res) => {
  try {
    const posts = await PortfolioPost.find({ pro: req.params.proId })
      .sort({ createdAt: -1 })
      .populate("pro", "firstName lastName avatar companyName");
    const userId = req.user?._id;
    const formatted = await Promise.all(posts.map((p) => formatPost(p, userId)));
    res.json(formatted);
  } catch (e) {
    handleError(res, e);
  }
};

exports.create = async (req, res) => {
  try {
    if (req.user.role !== "pro") {
      return res.status(403).json({ message: "Réservé aux artisans." });
    }
    if (req.user.proStatus !== "approved") {
      return res.status(403).json({
        message: "Votre compte artisan doit être approuvé pour publier.",
      });
    }

    const caption = req.body.caption?.trim();
    if (!caption) {
      return res.status(400).json({ error: "Description requise." });
    }

    const photos = await resolveUploadedFiles(req.files, "portfolio");
    const post = await PortfolioPost.create({
      pro: req.user._id,
      caption,
      photos,
      likes: [],
    });
    await post.populate("pro", "firstName lastName avatar companyName");
    res.status(201).json(await formatPost(post, req.user._id));
  } catch (e) {
    handleError(res, e);
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Publication introuvable." });
    if (
      post.pro.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Non autorisé." });
    }
    await PortfolioComment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Publication supprimée." });
  } catch (e) {
    handleError(res, e);
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Publication introuvable." });

    const userId = req.user._id.toString();
    const idx = post.likes.findIndex((id) => id.toString() === userId);
    if (idx >= 0) post.likes.splice(idx, 1);
    else post.likes.push(req.user._id);
    await post.save();

    res.json(await formatPost(post, req.user._id));
  } catch (e) {
    handleError(res, e);
  }
};

exports.listComments = async (req, res) => {
  try {
    const comments = await PortfolioComment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate("author", "firstName lastName avatar role");
    res.json(comments);
  } catch (e) {
    handleError(res, e);
  }
};

exports.addComment = async (req, res) => {
  try {
    const text = req.body.text?.trim();
    if (!text) return res.status(400).json({ error: "Commentaire vide." });

    const post = await PortfolioPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Publication introuvable." });

    const comment = await PortfolioComment.create({
      post: post._id,
      author: req.user._id,
      text,
    });
    await comment.populate("author", "firstName lastName avatar role");
    res.status(201).json(comment);
  } catch (e) {
    handleError(res, e);
  }
};
