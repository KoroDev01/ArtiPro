const Post = require("../database/models/post.model");
const Offer = require("../database/models/offer.model");
const User = require("../database/models/user.model");
const Category = require("../database/models/job_category.model");
const { resolveUploadedFiles } = require("../config/upload.config");
const { createNotification } = require("./notification.controller");

const handleError = (res, e) => res.status(400).json({ error: e.message });

exports.createPost = async (req, res) => {
  try {
    if (req.user.role !== "client")
      return res.status(403).json({ message: "Only clients can create posts" });
    const photos = await resolveUploadedFiles(req.files, "posts");
    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      budget: req.body.budget || undefined,
      location: req.body.city ? { city: req.body.city } : undefined,
      photos,
      client: req.user._id,
    });

    if (post.category) {
      const [pros, categoryDoc] = await Promise.all([
        User.find({
          role: "pro",
          proStatus: "approved",
          isBlocked: false,
          categories: post.category,
        }).select("_id"),
        Category.findById(post.category).select("name"),
      ]);

      const categoryName = categoryDoc?.name || "votre métier";
      const postLink = `/demandes/${post._id}`;

      await Promise.all(
        pros.map((pro) =>
          createNotification({
            recipient: pro._id,
            type: "new_post",
            message: `Nouvelle demande « ${post.title} » — ${categoryName}`,
            link: postLink,
          }),
        ),
      );
    }

    res.status(201).json(post);
  } catch (e) {
    handleError(res, e);
  }
};

exports.getPostList = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("category", "name")
      .populate("client", "firstName lastName email avatar")
      .sort({ createdAt: -1 });
    res.json(posts.map((p) => ({ ...p.toObject(), author: p.client })));
  } catch (e) {
    handleError(res, e);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("category", "name")
      .populate("client", "firstName lastName email avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ ...post.toObject(), author: post.client });
  } catch (e) {
    handleError(res, e);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await Offer.updateMany(
      { post: post._id, status: "pending" },
      { status: "rejected" },
    );
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (e) {
    handleError(res, e);
  }
};

exports.completePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.client.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Only the client can complete this post" });
    if (post.status !== "in_progress")
      return res
        .status(400)
        .json({ message: "Post must be in progress to be completed" });
    post.status = "completed";
    await post.save();
    res.json({ message: "Post marked as completed", post });
  } catch (e) {
    handleError(res, e);
  }
};
