// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000','https://pruto.vercel.app'], // add your frontend domain here
  credentials: true, // allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/admin', adminRoutes);

// app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("Pruto Backend Server is running"));
app.get("/healthz", (req, res) => {
  // You can add more robust checks here, like checking database connection
  // For now, a simple 200 OK is fine
  res.status(200).send("OK");
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!',err);
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
