const express = require("express");
const items = require("./items");
const router = express.Router();

router.get("/items", (req, res) => {
  res.json({
    serverTime: Date.now(),
    items
  });
});

module.exports = router;
