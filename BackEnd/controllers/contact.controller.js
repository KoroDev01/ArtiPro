const { sendContactEmail } = require("../config/mailer.config.js");

exports.sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(200).json({ message: "Message envoyé. Nous vous répondrons bientôt." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
