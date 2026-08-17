const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AICommerce API is running",
  });
});

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});