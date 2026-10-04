const express = require("express");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// GET ADMIN DASHBOARD STATS
// =========================

router.get(
    "/stats",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            // Total products

            const totalProducts =
                await Product.countDocuments();


            // Total users

            const totalUsers =
                await User.countDocuments();


            // Total orders

            const totalOrders =
                await Order.countDocuments();


            // Orders by status

            const processingOrders =
                await Order.countDocuments({
                    status: "Processing"
                });


            const shippedOrders =
                await Order.countDocuments({
                    status: "Shipped"
                });


            const deliveredOrders =
                await Order.countDocuments({
                    status: "Delivered"
                });


            const cancelledOrders =
                await Order.countDocuments({
                    status: "Cancelled"
                });


            // Calculate revenue
            // Cancelled orders are excluded

            const revenueResult =
                await Order.aggregate([

                    {
                        $match: {
                            status: {
                                $ne: "Cancelled"
                            }
                        }
                    },

                    {
                        $group: {
                            _id: null,
                            totalRevenue: {
                                $sum: "$totalAmount"
                            }
                        }
                    }

                ]);


            const totalRevenue =
                revenueResult.length > 0
                    ? revenueResult[0].totalRevenue
                    : 0;


            res.json({

                totalProducts,

                totalUsers,

                totalOrders,

                totalRevenue,

                ordersByStatus: {

                    Processing:
                        processingOrders,

                    Shipped:
                        shippedOrders,

                    Delivered:
                        deliveredOrders,

                    Cancelled:
                        cancelledOrders

                }

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:
                    "Failed to load dashboard statistics"

            });

        }

    }
);


module.exports = router;