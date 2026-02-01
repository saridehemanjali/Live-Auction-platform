import React, { useEffect, useState } from "react";
import "./ItemCard.css";

const ItemCard = ({ item, username, placeBid }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, item.endTime - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, item.endTime - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [item.endTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const auctionEnded = timeLeft <= 0;
  const isWinner = auctionEnded && item.highestBidder === username;

  return (
    <div
      className={`item-card ${
        item.flash
          ? item.highestBidder === username
            ? "flash-green"
            : "flash-red"
          : ""
      }`}
    >
      <h3>{item.title}</h3>
      <p>Starting Price: ${item.startingPrice}</p>
      <p>Current Bid: ${item.currentBid}</p>

      <p>
        Highest Bidder:{" "}
        <strong>{item.highestBidder || "No bids yet"}</strong>
      </p>

      <p>
        Auction Ends In: {auctionEnded ? "Ended" : formatTime(timeLeft)}
      </p>

      {!auctionEnded && (
        <button onClick={() => placeBid(item.id, item.currentBid)}>
          Bid +$10
        </button>
      )}

      {auctionEnded && (
        <span className={`badge ${isWinner ? "winner" : "outbid-badge"}`}>
          {isWinner ? "🏆 You Won!" : "❌ Outbid"}
        </span>
      )}
    </div>
  );
};

export default ItemCard;
