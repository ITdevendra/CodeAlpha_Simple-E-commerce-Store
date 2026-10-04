const express = require("express");
const Product = require("../models/Product");

const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// GET ALL PRODUCTS
// =========================

router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find();

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Failed to fetch products"
        });
    }
});


// =========================
// GET SINGLE PRODUCT
// =========================

router.get("/:id", async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found"
            });
        }


        res.json(product);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Failed to fetch product"
        });
    }
});


// =========================
// CREATE PRODUCT
// ADMIN ONLY
// =========================

router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                image,
                category,
                stock
            } = req.body;


            // Validate required fields

            if (
                !name ||
                !description ||
                price === undefined ||
                !image ||
                !category ||
                stock === undefined
            ) {

                return res.status(400).json({
                    message:
                        "All product fields are required"
                });
            }


            // Validate price

            if (Number(price) < 0) {

                return res.status(400).json({
                    message:
                        "Price cannot be negative"
                });
            }


            // Validate stock

            if (Number(stock) < 0) {

                return res.status(400).json({
                    message:
                        "Stock cannot be negative"
                });
            }


            // Create product

            const product =
                await Product.create({

                    name:
                        name.trim(),

                    description:
                        description.trim(),

                    price:
                        Number(price),

                    image:
                        image.trim(),

                    category:
                        category.trim(),

                    stock:
                        Number(stock)

                });


            res.status(201).json({

                message:
                    "Product created successfully",

                product

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to create product"
            });
        }
    }
);

// =========================
// UPDATE PRODUCT
// ADMIN ONLY
// =========================

router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                image,
                category,
                stock
            } = req.body;


            // Validate required fields

            if (
                !name ||
                !description ||
                price === undefined ||
                !image ||
                !category ||
                stock === undefined
            ) {

                return res.status(400).json({
                    message:
                        "All product fields are required"
                });
            }


            // Validate price

            if (Number(price) < 0) {

                return res.status(400).json({
                    message:
                        "Price cannot be negative"
                });
            }


            // Validate stock

            if (Number(stock) < 0) {

                return res.status(400).json({
                    message:
                        "Stock cannot be negative"
                });
            }


            // Find and update product

            const product =
                await Product.findByIdAndUpdate(
                    req.params.id,

                    {
                        name: name.trim(),

                        description:
                            description.trim(),

                        price: Number(price),

                        image: image.trim(),

                        category:
                            category.trim(),

                        stock: Number(stock)
                    },

                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }


            res.json({

                message:
                    "Product updated successfully",

                product

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to update product"
            });
        }
    }
);

// =========================
// DELETE PRODUCT
// ADMIN ONLY
// =========================

router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const product =
                await Product.findByIdAndDelete(
                    req.params.id
                );


            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }


            res.json({

                message:
                    "Product deleted successfully",

                productId:
                    product._id

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to delete product"
            });
        }
    }
);

// =========================
// UPDATE PRODUCT - ADMIN
// =========================

router.put("/:id", protect, adminOnly, async (req, res) => {

    try {

        // Validate Product ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                message: "Invalid product ID"
            });

        }


        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;


        // Validate required fields
        if (
            !name ||
            !description ||
            price === undefined ||
            !image ||
            !category ||
            stock === undefined
        ) {

            return res.status(400).json({
                message: "All product fields are required"
            });

        }


        // Validate numbers
        if (
            Number(price) < 0 ||
            Number(stock) < 0
        ) {

            return res.status(400).json({
                message:
                    "Price and stock cannot be negative"
            });

        }


        const product =
            await Product.findByIdAndUpdate(

                req.params.id,

                {
                    name: name.trim(),
                    description: description.trim(),
                    price: Number(price),
                    image: image.trim(),
                    category: category.trim(),
                    stock: Number(stock)
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }


        res.json({

            message:
                "Product updated successfully",

            product

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update product"
        });

    }

});

// =========================
// DELETE PRODUCT - ADMIN
// =========================

router.delete("/:id", protect, adminOnly, async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                message: "Invalid product ID"
            });

        }

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete product"
        });

    }

});
module.exports = router;