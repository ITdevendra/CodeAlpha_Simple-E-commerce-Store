const express = require("express");

const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// GET ALL ORDERS
// ADMIN ONLY
// =========================

router.get("/", protect, adminOnly, async (req, res) => {

    try {

        const orders = await Order.find()
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

});


// =========================
// GET SINGLE ORDER
// ADMIN ONLY
// =========================

router.get(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.id
                )
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product"
                );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found"

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

    }
);


// =========================
// UPDATE ORDER STATUS
// ADMIN ONLY
// =========================

router.put(
    "/:id/status",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const { status } = req.body;


            // Allowed statuses

            const allowedStatuses = [
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid order status"

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


            // Prevent changing
            // a delivered order

            if (
                order.status === "Delivered"
            ) {

                return res.status(400).json({

                    message:
                        "Delivered order cannot be changed"

                });

            }


            // Prevent changing
            // a cancelled order

            if (
                order.status === "Cancelled"
            ) {

                return res.status(400).json({

                    message:
                        "Cancelled order cannot be changed"

                });

            }


            order.status = status;

            await order.save();


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