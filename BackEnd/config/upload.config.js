const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const cloudinaryEnabled = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

exports.isCloudinaryEnabled = () => cloudinaryEnabled;

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Seules les images sont acceptées"), false);
};

const limits = { fileSize: 2 * 1024 * 1024 };

const diskStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/images/${folder}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

const storageFor = (folder) =>
  cloudinaryEnabled ? multer.memoryStorage() : diskStorage(folder);

exports.uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `artipro/${folder}`, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result.secure_url)),
    );
    stream.end(buffer);
  });

exports.resolveUploadedFiles = async (files, folder) => {
  if (!files?.length) return [];
  if (!cloudinaryEnabled) {
    return files.map((f) => f.filename);
  }
  const urls = [];
  for (const file of files) {
    urls.push(await exports.uploadToCloudinary(file.buffer, folder));
  }
  return urls;
};

exports.resolveUploadedFile = async (file, folder) => {
  if (!file) return null;
  if (!cloudinaryEnabled) return `/images/${folder}/${file.filename}`;
  return exports.uploadToCloudinary(file.buffer, folder);
};

exports.uploadAvatar = multer({
  storage: storageFor("avatars"),
  fileFilter,
  limits,
}).single("avatar");

exports.uploadPost = multer({
  storage: storageFor("posts"),
  fileFilter,
  limits,
}).array("photos", 3);

exports.uploadPortfolio = multer({
  storage: storageFor("portfolio"),
  fileFilter,
  limits,
}).array("photos", 4);
