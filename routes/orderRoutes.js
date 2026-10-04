const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// CREATE NEW ORDER
// =========================

router.post("/", protect, async (req, res) => {

    try {

        const {
            items,
            shippingAddress
        } = req.body;


        // Validate items

        if (!items || items.length === 0) {

            return res.status(400).json({
                message: "Cart is empty"
            });

        }


        // Validate shipping address

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.pincode
        ) {

            return res.status(400).json({
                message:
                    "Complete shipping address is required"
            });

        }


        // Prevent duplicate products

        const productMap = new Map();


        for (const item of items) {

            if (
                !item.product ||
                item.quantity === undefined ||
                item.quantity === null
            ) {

                return res.status(400).json({
                    message:
                        "Product and quantity are required"
                });

            }


            if (!productMap.has(item.product)) {

                productMap.set(
                    item.product,
                    item.quantity
                );

            } else {

                productMap.set(
                    item.product,
                    productMap.get(item.product) +
                    item.quantity
                );

            }

        }


        const uniqueItems = Array.from(
            productMap,
            ([product, quantity]) => ({
                product,
                quantity
            })
        );


        // Prepare order data

        const orderItems = [];

        let totalAmount = 0;


        // Check every product

        for (const item of uniqueItems) {

            if (
                !/^[0-9a-fA-F]{24}$/.test(
                    item.product
                )
            ) {

                return res.status(400).json({
                    message:
                        `Invalid product ID: ${item.product}`
                });

            }


            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {

                return res.status(400).json({
                    message:
                        "Invalid quantity"
                });

            }


            if (item.quantity > 100) {

                return res.status(400).json({
                    message:
                        "Maximum quantity is 100 per product"
                });

            }


            const product =
                await Product.findById(
                    item.product
                );


            if (!product) {

                return res.status(404).json({
                    message:
                        `Product not found: ${item.product}`
                });

            }


            if (
                product.stock <
                item.quantity
            ) {

                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock`
                });

            }


            const itemTotal =
                product.price *
                item.quantity;


            totalAmount += itemTotal;


            orderItems.push({

                product: product._id,

                name: product.name,

                price: product.price,

                quantity: item.quantity

            });

        }


        // Create order

        const order =
            await Order.create({

                user: req.user,

                items: orderItems,

                totalAmount,

                shippingAddress

            });


        // Reduce stock

        const updatedProducts = [];


        try {

            for (const item of uniqueItems) {

                const updatedProduct =
                    await Product.findOneAndUpdate(

                        {
                            _id: item.product,

                            stock: {
                                $gte: item.quantity
                            }
                        },

                        {
                            $inc: {
                                stock: -item.quantity
                            }
                        },

                        {
                            new: true
                        }

                    );


                if (!updatedProduct) {

                    throw new Error(
                        "STOCK_UPDATE_FAILED"
                    );

                }


                updatedProducts.push({

                    productId:
                        item.product,

                    quantity:
                        item.quantity

                });

            }


        } catch (stockError) {

            console.error(
                "Stock update failed:",
                stockError
            );


            // Rollback stock

            for (
                const updatedProduct
                of updatedProducts
            ) {

                await Product.findByIdAndUpdate(

                    updatedProduct.productId,

                    {
                        $inc: {
                            stock:
                                updatedProduct.quantity
                        }
                    }

                );

            }


            // Delete order

            await Order.findByIdAndDelete(
                order._id
            );


            return res.status(400).json({

                message:
                    "Stock changed while placing the order. Please try again."

            });

        }


        res.status(201).json({

            message:
                "Order placed successfully",

            order

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to create order"

        });

    }

});


// =========================
// GET ALL ORDERS
// OF LOGGED-IN USER
// =========================

router.get("/", protect, async (req, res) => {

    try {

        const orders =
            await Order.find({

                user: req.user

            }).sort({

                createdAt: -1

            });


        res.json({

            orders

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to get orders"

        });

    }

});


// =========================
// GET SINGLE ORDER
// =========================

router.get("/:id", protect, async (req, res) => {

    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({
                message: "Invalid order ID"
            });

        }


        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found"

            });

        }


        if (
            order.user.toString() !==
            req.user.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to view this order"

            });

        }


        res.json({

            order

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to get order"

        });

    }

});


// ==================================================
// ADMIN - GET ALL ORDERS
// GET /api/orders/admin
// ==================================================

router.get(
    "/admin",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const orders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.json({

                orders

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:
                    "Failed to get all orders"

            });

        }

    }
);


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// PUT /api/orders/admin/:id/status
// ==================================================

router.put(
    "/admin/:id/status",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            // Validate order ID

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.params.id
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid order ID"

                });

            }


            // Allowed statuses

            const allowedStatuses = [

                "Processing",

                "Shipped",

                "Delivered",

                "Cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid order status"

                });

            }


            // Update order

            const order =
                await Order.findByIdAndUpdate(

                    req.params.id,

                    {
                        status
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                ).populate(
                    "user",
                    "name email"
                );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found"

                });

            }


            res.json({

                message:
                    "Order status updated successfully",

                order

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:
                    "Failed to update order status"

            });

        }

    }
);


module.exports = router;