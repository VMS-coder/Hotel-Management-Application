
const multer = require("multer");
const path = require("path");

// Where to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
},

  // Generate unique filename
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1E9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;
