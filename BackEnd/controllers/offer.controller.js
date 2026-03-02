const Offer = require("../database/models/offer.model");
const Post = require("../database/models/post.model");

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

    const offer = await Offer.create({
      post: postId,
      pro: req.user._id,
      client: post.client,
      price,
      message,
    });

    res.status(201).json(offer);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.getOffersByPost = async (req, res) => {
  try {
    const offers = await Offer.find({
      post: req.params.postId,
    })
      .populate("pro", "firstName ratingAverage")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId).populate("post");

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

    // Mettre le post en in_progress
    offer.post.status = "in_progress";
    await offer.post.save();

    res.json({ message: "Offer accepted", offer });
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

    // 1️⃣ Accepter l'offre sélectionnée
    offer.status = "accepted";
    await offer.save();

    // 2️⃣ Rejeter toutes les autres offres du même post
    await Offer.updateMany(
      {
        post: offer.post,
        _id: { $ne: offer._id },
      },
      { status: "rejected" },
    );

    // 3️⃣ Mettre le post en in_progress
    await Post.findByIdAndUpdate(offer.post, {
      status: "in_progress",
    });

    res.json({
      message: "Offer accepted. Other offers rejected.",
      offer,
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

    // 🔒 Vérifier que le post est open
    if (post.status !== "open") {
      return res.status(400).json({
        message: "You cannot send an offer. Post is not open.",
      });
    }

    // 🔒 Vérifier que le pro correspond à la catégorie
    if (!req.user.categories.includes(post.category)) {
      return res.status(403).json({
        message: "You are not qualified for this category",
      });
    }

    // 🔒 Empêcher double offre du même pro
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
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};