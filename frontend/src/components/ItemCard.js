import React from "react";
import Countdown from "./Countdown";
import "./ItemCard.css";

const ItemCard = ({ item, username, placeBid, serverTime }) => {
  const auctionEnded = Date.now() >= item.endTime;
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
        Auction Ends In:{" "}
        <Countdown endTime={item.endTime} serverTime={serverTime} />
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
