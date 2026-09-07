const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve frontend
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});