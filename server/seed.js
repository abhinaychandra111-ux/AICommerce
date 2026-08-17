const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Nova X1 Smartphone",
    category: "Electronics",
    price: 24999,
    oldPrice: 29999,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    description:
      "Premium smartphone with powerful performance and modern design.",
    stock: 25,
  },
  {
    name: "UltraBass Wireless Headphones",
    category: "Audio",
    price: 3999,
    oldPrice: 5999,
    rating: 4.6,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    description:
      "Wireless headphones with immersive sound and comfortable ear cushions.",
    stock: 40,
  },
  {
    name: "SmartFit Pro Watch",
    category: "Wearables",
    price: 5499,
    oldPrice: 6999,
    rating: 4.7,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    description:
      "Smart wearable with fitness tracking and everyday health features.",
    stock: 30,
  },
  {
    name: "ProBook Air Laptop",
    category: "Computers",
    price: 64999,
    oldPrice: 74999,
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    badge: "Top Rated",
    description:
      "Powerful lightweight laptop designed for productivity and entertainment.",
    stock: 15,
  },
  {
    name: "Mechanical RGB Keyboard",
    category: "Accessories",
    price: 3499,
    oldPrice: 4499,
    rating: 4.5,
    reviews: 61,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
    description:
      "Mechanical gaming keyboard with customizable RGB lighting.",
    stock: 50,
  },
  {
    name: "Precision Wireless Mouse",
    category: "Accessories",
    price: 1499,
    oldPrice: 1999,
    rating: 4.4,
    reviews: 48,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
    badge: "Deal",
    description:
      "Ergonomic wireless mouse designed for precise everyday control.",
    stock: 60,
  },
  {
    name: "Vision 4K Monitor",
    category: "Computers",
    price: 28999,
    oldPrice: 34999,
    rating: 4.8,
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    badge: "Featured",
    description:
      "High-resolution 4K monitor for work, gaming and creative applications.",
    stock: 20,
  },
  {
    name: "Portable Power Bank",
    category: "Accessories",
    price: 1999,
    oldPrice: 2499,
    rating: 4.3,
    reviews: 37,
    image:
      "https://images.unsplash.com/photo-1609592424270-0c7b8c7d9d4a?auto=format&fit=crop&w=800&q=80",
    badge: "Value Pick",
    description:
      "Compact high-capacity power bank for charging devices on the go.",
    stock: 45,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();