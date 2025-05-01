const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: "uploads/", // make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1689839219823.jpg
  },
});

const upload = multer({ storage });

// POST route to upload image
router.post("/", upload.single("image"), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

module.exports = router;
