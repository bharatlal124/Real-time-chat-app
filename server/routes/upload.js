// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // Setup multer storage
// const storage = multer.diskStorage({
//   destination: "uploads/", // make sure this folder exists
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1689839219823.jpg
//   },
// });

// const upload = multer({ storage });

// // POST route to upload image
// router.post("/", upload.single("image"), (req, res) => {
//   const imageUrl = `/uploads/${req.file.filename}`;
//   res.json({ url: imageUrl });
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Save to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Return relative path to image
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
