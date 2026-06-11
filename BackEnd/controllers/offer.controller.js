const Offer = require("../database/models/offer.model");
const Post = require("../database/models/post.model");
const { createNotification } = require("./notification.controller");

exports.getOffersByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.client.toString() === req.user._id.toString();
    const hasOffer = await Offer.exists({
      post: post._id,
      pro: req.user._id,
    });

    if (!isOwner && !hasOffer && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const offers = await Offer.find({
      post: req.params.postId,
    })
      .populate("pro", "firstName lastName ratingAverage")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to accept this offer",
      });
    }

    offer.status = "accepted";
    await offer.save();

    await Offer.updateMany(
      {
        post: offer.post,
        _id: { $ne: offer._id },
      },
      { status: "rejected" },
    );

    await Post.findByIdAndUpdate(offer.post, {
      status: "in_progress",
    });

    res.json({
      message: "Offer accepted. Other offers rejected.",
      offer,
    });

    await createNotification({
      recipient: offer.pro,
      type: "offer_accepted",
      message: `Votre offre a été acceptée !`,
      link: `/demandes/${offer.post.toString()}`,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { postId, price, message } = req.body;

    if (req.user.role !== "pro") {
      return res.status(403).json({
        message: "Only pros can send offers",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "open") {
      return res.status(400).json({
        message: "You cannot send an offer. Post is not open.",
      });
    }

    if (!post.client) {
      return res.status(400).json({ message: "Post has no client assigned." });
    }

    if (
      !req.user.categories.some(
        (c) => c.toString() === post.category?.toString(),
      )
    ) {
      return res.status(403).json({
        message: "You are not qualified for this category",
      });
    }

    const existingOffer = await Offer.findOne({
      post: postId,
      pro: req.user._id,
    });

    if (existingOffer) {
      return res.status(400).json({
        message: "You have already sent an offer for this post",
      });
    }

    const offer = await Offer.create({
      post: postId,
      pro: req.user._id,
      client: post.client,
      price,
      message,
    });

    res.status(201).json(offer);

    await createNotification({
      recipient: post.client,
      type: "new_offer",
      message: `Nouvelle offre de ${req.user.firstName} pour "${post.title}"`,
      link: `/demandes/${postId}`,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getMyOffers = async (req, res) => {
  try {
    const filter =
      req.user.role === "pro"
        ? { pro: req.user._id }
        : { client: req.user._id };

    const offers = await Offer.find(filter)
      .populate("post", "title status")
      .populate("pro", "firstName lastName ratingAverage")
      .populate("client", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
