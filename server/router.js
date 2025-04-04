// router.js
const express = require("express");
const router = express.Router();
const Message = require("./models/message");

router.get("/", (req, res) => {
  res.status(200).json({ response: "Server is up and running." });
});





// New route: fetch messages by room
router.get("/messages/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

router.get("/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});



module.exports = router;





