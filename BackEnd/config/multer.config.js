const multer = require("multer");
const path = require("path");

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/images/${folder}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont acceptées"), false);
  }
};

const limits = { fileSize: 2 * 1024 * 1024 };

const uploadAvatar = multer({
  storage: makeStorage("avatars"),
  fileFilter,
  limits,
});
const uploadPost = multer({
  storage: makeStorage("posts"),
  fileFilter,
  limits,
});

module.exports = { uploadAvatar, uploadPost };
