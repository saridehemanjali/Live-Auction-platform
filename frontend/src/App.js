import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard";
import { socket } from "./socket";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [serverTime, setServerTime] = useState(0);
  const [username, setUsername] = useState("");     // confirmed name
const [tempName, setTempName] = useState("");     // input typing


  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then(res => res.json())
      .then(data => {
        setItems(data.items);
        setServerTime(data.serverTime);
      });

    socket.on("UPDATE_BID", ({ itemId, bid, user }) => {
      setItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, currentBid: bid, highestBidder: user, flash: true }
            : item
        )
      );

      setTimeout(() => {
        setItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, flash: false } : item
          )
        );
      }, 500);
    });

    socket.on("OUTBID", ({ itemId, message }) => {
      setItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, outbidMessage: message } : item
        )
      );
    });

    return () => {
      socket.off("UPDATE_BID");
      socket.off("OUTBID");
    };
  }, []);

  const placeBid = (itemId, currentBid) => {
  socket.emit("BID_PLACED", {
    itemId,
    bid: currentBid + 10,
    user: username
  });
};


  if (!username) {
  return (
    <div className="username-screen">
      <h2>Enter your name to join auction</h2>

      <input
        placeholder="Your name (min 3 chars)"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && tempName.trim().length >= 3) {
            setUsername(tempName.trim());
          }
        }}
      />

      {tempName && tempName.length < 3 && (
        <p style={{ color: "red" }}>Name must be at least 3 characters</p>
      )}
    </div>
  );
}



  return (
    <div className="container">
      <h1>🔥 Live Bidding Platform</h1>
      <div className="grid">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            username={username}
            placeBid={placeBid}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
