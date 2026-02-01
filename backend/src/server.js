const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// Auction items (in-memory)
let items = [
  { id: 1, title: "iPhone 15", startingPrice: 500, currentBid: 500, endTime: Date.now() + 60000, highestBidder: null },
  { id: 2, title: "MacBook Pro", startingPrice: 1000, currentBid: 1000, endTime: Date.now() + 120000, highestBidder: null },
];

// Lock to handle race conditions
const itemLocks = {};

// REST API
app.get("/items", (req, res) => {
  res.json({ items, serverTime: Date.now() });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("BID_PLACED", ({ itemId, bid, user }) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Auction ended
    if (Date.now() > item.endTime) {
      socket.emit("OUTBID", { itemId, message: "Auction ended" });
      return;
    }

    // Race condition lock
    if (itemLocks[itemId]) {
      socket.emit("OUTBID", { itemId, message: "Too fast! Someone else bid" });
      return;
    }

    itemLocks[itemId] = true;

    // Validate bid
    if (bid > item.currentBid) {
      item.currentBid = bid;
      item.highestBidder = user;

      // Broadcast update
      io.emit("UPDATE_BID", { itemId, bid, user });
    } else {
      socket.emit("OUTBID", { itemId, message: "Your bid is too low" });
    }

    itemLocks[itemId] = false;
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(4000, () => console.log("Server running on port 4000"));
