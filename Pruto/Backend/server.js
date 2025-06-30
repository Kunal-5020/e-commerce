// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// app.use("/api/products", productRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Pruto Backend Server is running"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
