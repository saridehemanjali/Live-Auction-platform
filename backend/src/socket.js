const items = require("./items");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("BID_PLACED", ({ itemId, amount, userId }) => {
      const item = items.find(i => i.id === itemId);

      if (!item) return;

      // 🔒 Server-side validation
      if (Date.now() > item.endTime) {
        return socket.emit("BID_ERROR", "Auction Ended");
      }

      if (amount <= item.currentBid) {
        return socket.emit("BID_ERROR", "Outbid");
      }

      // ✅ Atomic update (no await here)
      item.currentBid = amount;
      item.highestBidder = userId;

      // 🔥 Broadcast to everyone
      io.emit("UPDATE_BID", item);
    });
  });
};
