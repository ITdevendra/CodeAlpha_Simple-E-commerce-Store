const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");

dotenv.config();

const products = [
    {
        name: "Wireless Headphones",
        description: "Comfortable wireless headphones with clear sound.",
        price: 1999,
        image: "https://via.placeholder.com/300",
        category: "Electronics",
        stock: 20
    },
    {
        name: "Smart Watch",
        description: "Smart watch with fitness tracking and notifications.",
        price: 2499,
        image: "https://via.placeholder.com/300",
        category: "Electronics",
        stock: 15
    },
    {
        name: "Running Shoes",
        description: "Lightweight shoes suitable for running and workouts.",
        price: 1799,
        image: "https://via.placeholder.com/300",
        category: "Footwear",
        stock: 30
    },
    {
        name: "Backpack",
        description: "Durable backpack suitable for college and travel.",
        price: 999,
        image: "https://via.placeholder.com/300",
        category: "Accessories",
        stock: 25
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Products added successfully");

        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

seedProducts();