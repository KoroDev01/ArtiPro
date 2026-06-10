const Review = require("../database/models/review.model");
const Post = require("../database/models/post.model");
const User = require("../database/models/user.model");

exports.createReview = async (req, res) => {
  try {
    const { postId, rating, comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "completed") {
      return res.status(400).json({
        message: "You can only review completed posts",
      });
    }

    if (post.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the client can leave a review",
      });
    }

    const existingReview = await Review.findOne({
      post: postId,
      client: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review already exists for this post",
      });
    }

    const acceptedOffer =
      await require("../database/models/offer.model").findOne({
        post: postId,
        status: "accepted",
      });

    if (!acceptedOffer) {
      return res.status(400).json({
        message: "No accepted offer found",
      });
    }

    const review = await Review.create({
      post: postId,
      client: req.user._id,
      pro: acceptedOffer.pro,
      rating,
      comment,
    });

    const pro = await User.findById(acceptedOffer.pro);

    const totalRating = pro.ratingAverage * pro.ratingCount + rating;

    pro.ratingCount += 1;
    pro.ratingAverage = totalRating / pro.ratingCount;

    await pro.save();

    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getReviewsByPro = async (req, res) => {
  try {
    const reviews = await Review.find({ pro: req.params.proId })
      .populate("client", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getReviewByPost = async (req, res) => {
  try {
    const review = await Review.findOne({
      post: req.params.postId,
      client: req.user._id,
    });
    if (!review) return res.status(404).json({ message: "No review" });
    res.json(review);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};