# 🔥 Live Bidding Platform (Real-Time Auction App)

This project is a **real-time auction platform** where multiple users bid on items simultaneously in the final seconds.  
It is built to demonstrate **real-time systems, race condition handling, and clean frontend-backend sync**.

---

## 🧠 What This Project Does (In Simple Words)

- Multiple users join the auction using their **name**
- Each auction item runs **independently**
- Users place bids in real time using **Socket.io**
- The **highest bidder at auction end wins**
- UI instantly reacts:
  - 🟢 Green flash → when **you** place the highest bid
  - 🔴 Red flash → when **someone else** outbids you
  - 🏆 Winner badge → when auction ends

---

## ⚠️ Core Bottleneck (The Main Challenge)

### 🧨 Race Condition (Human Explanation)

If **two users bid at the same millisecond**, both requests reach the server almost together.

**Problem:**  
Both think they are the highest bidder ❌

**Solution:**  
The backend:
- Processes bids **one at a time**
- Accepts the **first valid bid**
- Instantly rejects the second with an **OUTBID error**

This ensures **data consistency** and correct winners.

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express
- Socket.io

### Frontend
- React
- Socket.io-client
- CSS animations for live feedback

---


## 🚀 How to Run Locally (Very Simple)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm start

Backend runs on:

### http://localhost:4000

2️⃣ Frontend Setup
cd frontend
npm install
npm start
Frontend runs on:

## http://localhost:3000
