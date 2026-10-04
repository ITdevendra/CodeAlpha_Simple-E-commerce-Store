const ordersList =
    document.getElementById("orders-list");


async function loadOrders() {

    try {

        const response = await fetch(
            "/api/orders",
            {
                credentials: "include"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            ordersList.innerHTML = `
                <p>${data.message}</p>

                <a href="/login.html">
                    Login
                </a>
            `;

            return;
        }


        const orders = data.orders;


        if (orders.length === 0) {

            ordersList.innerHTML = `
                <p>
                    You haven't placed any orders yet.
                </p>

                <a href="/">
                    Start Shopping
                </a>
            `;

            return;
        }


        ordersList.innerHTML = "";


        orders.forEach(order => {

            const orderElement =
                document.createElement("div");

            orderElement.className =
                "order-list-card";


            // =========================
            // ORDER STATUS TIMELINE
            // =========================

            let timelineHTML = "";


            if (order.status === "Cancelled") {

                timelineHTML = `
                    <div class="order-timeline">

                        <div class="timeline-step cancelled">
                            Order Cancelled
                        </div>

                    </div>
                `;

            } else {

                timelineHTML = `
                    <div class="order-timeline">

                        <div class="timeline-step
                            ${
                                ["Processing", "Shipped", "Delivered"]
                                    .includes(order.status)
                                    ? "active"
                                    : ""
                            }">

                            Processing

                        </div>


                        <div class="timeline-step
                            ${
                                ["Shipped", "Delivered"]
                                    .includes(order.status)
                                    ? "active"
                                    : ""
                            }">

                            Shipped

                        </div>


                        <div class="timeline-step
                            ${
                                order.status === "Delivered"
                                    ? "active"
                                    : ""
                            }">

                            Delivered

                        </div>

                    </div>
                `;
            }


            // =========================
            // ORDER ITEMS
            // =========================

            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `
                    <div class="order-list-item">

                        <span>
                            ${item.name}
                            × ${item.quantity}
                        </span>

                        <span>
                            ₹${item.price * item.quantity}
                        </span>

                    </div>
                `;

            });


            // =========================
            // ORDER DATE
            // =========================

            const orderDate =
                new Date(order.createdAt)
                    .toLocaleDateString();


            // =========================
            // ORDER CARD
            // =========================

            orderElement.innerHTML = `

                <h3>
                    Order #${order._id}
                </h3>


                <p>
                    Date:
                    ${orderDate}
                </p>


                <p>
                    Status:

                    <span
                        class="order-status status-${order.status.toLowerCase()}"
                    >
                        ${order.status}
                    </span>
                </p>


                ${timelineHTML}


                <div>
                    ${itemsHTML}
                </div>


                <h3>
                    Total:
                    ₹${order.totalAmount}
                </h3>


                <a
                    href="/order-success.html?id=${order._id}"
                >
                    View Details
                </a>

            `;


            ordersList.appendChild(
                orderElement
            );

        });


    } catch (error) {

        console.error(error);

        ordersList.innerHTML = `
            <p>
                Failed to load orders.
            </p>
        `;
    }
}


// =========================
// LOAD ORDERS
// =========================

loadOrders();