const ordersContainer =
    document.getElementById(
        "admin-orders-list"
    );


// =========================
// CHECK ADMIN ACCESS
// =========================

async function checkAdminAccess() {

    try {

        const response =
            await fetch(
                "/api/auth/me",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            alert(
                "Please login as an admin."
            );

            window.location.href =
                "/login.html";

            return false;

        }


        const data =
            await response.json();


        const user =
            data.user;


        if (
            !user ||
            user.role !== "admin"
        ) {

            alert(
                "Admin access required."
            );

            window.location.href =
                "/";

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Admin authentication failed:",
            error
        );


        window.location.href =
            "/login.html";


        return false;

    }

}


// =========================
// LOAD ALL ORDERS
// =========================

async function loadAdminOrders() {

    try {

        const response =
            await fetch(
                "/api/admin/orders",
                {
                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            ordersContainer.innerHTML = `
                <p>
                    ${data.message}
                </p>
            `;

            return;

        }


        const orders =
            data.orders;


        if (
            !orders ||
            orders.length === 0
        ) {

            ordersContainer.innerHTML = `
                <p>
                    No orders found.
                </p>
            `;

            return;

        }


        ordersContainer.innerHTML = "";


        orders.forEach(order => {

            const orderElement =
                document.createElement(
                    "div"
                );


            orderElement.className =
                "order-list-card";


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


            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleString();


            orderElement.innerHTML = `

                <h3>
                    Order #${order._id}
                </h3>


                <p>
                    <strong>
                        Customer:
                    </strong>

                    ${order.user?.name || "Unknown"}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>

                    ${order.user?.email || "Unknown"}
                </p>


                <p>
                    <strong>
                        Date:
                    </strong>

                    ${orderDate}
                </p>


                <h4>
                    Products
                </h4>


                <div>
                    ${itemsHTML}
                </div>


                <h3>
                    Total:
                    ₹${order.totalAmount}
                </h3>


                <h4>
                    Shipping Address
                </h4>


                <p>
                    ${order.shippingAddress.fullName}
                </p>

                <p>
                    ${order.shippingAddress.address}
                </p>

                <p>
                    ${order.shippingAddress.city}
                    -
                    ${order.shippingAddress.pincode}
                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    <span class="order-status status-${order.status.toLowerCase()}">
                        ${order.status}
                    </span>

                </p>


                ${
                    order.status === "Delivered" ||
                    order.status === "Cancelled"

                    ? ""

                    : `

                        <div class="admin-order-actions">

                            <select
                                id="status-${order._id}"
                            >

                                <option
                                    value="Processing"
                                    ${order.status === "Processing" ? "selected" : ""}
                                >
                                    Processing
                                </option>

                                <option
                                    value="Shipped"
                                    ${order.status === "Shipped" ? "selected" : ""}
                                >
                                    Shipped
                                </option>

                                <option
                                    value="Delivered"
                                >
                                    Delivered
                                </option>

                                <option
                                    value="Cancelled"
                                >
                                    Cancelled
                                </option>

                            </select>


                            <button
                                onclick="updateOrderStatus('${order._id}')"
                            >
                                Update Status
                            </button>

                        </div>

                    `
                }

            `;


            ordersContainer.appendChild(
                orderElement
            );

        });


    } catch (error) {

        console.error(error);


        ordersContainer.innerHTML = `

            <p>
                Failed to load orders.
            </p>

        `;

    }

}


// =========================
// UPDATE ORDER STATUS
// =========================

async function updateOrderStatus(orderId) {

    const select =
        document.getElementById(
            `status-${orderId}`
        );


    const status =
        select.value;


    try {

        const response =
            await fetch(
                `/api/admin/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        status
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert(
            "Order status updated successfully"
        );


        loadAdminOrders();


    } catch (error) {

        console.error(error);


        alert(
            "Failed to update order status"
        );

    }

}


// =========================
// INITIALIZE ADMIN PAGE
// =========================

async function initializeAdminPage() {

    const isAdmin =
        await checkAdminAccess();


    if (!isAdmin) {
        return;
    }


    loadAdminOrders();

}


initializeAdminPage();