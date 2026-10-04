const orderDetails =
    document.getElementById("order-details");


// Get order ID from URL
const params = new URLSearchParams(
    window.location.search
);

const orderId = params.get("id");


async function loadOrder() {

    if (!orderId) {

        orderDetails.innerHTML = `
            <p>Order ID not found.</p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `/api/orders/${orderId}`,
            {
                credentials: "include"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            orderDetails.innerHTML = `
                <p>${data.message}</p>
            `;

            return;
        }


        const order = data.order;


        let itemsHTML = "";


        order.items.forEach(item => {

            itemsHTML += `
                <div class="order-item">

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


        orderDetails.innerHTML = `

            <div class="order-card">

                <h3>
                    Order ID
                </h3>

                <p>
                    ${order._id}
                </p>


                <h3>
                    Items
                </h3>

                ${itemsHTML}


                <h3>
                    Total
                </h3>

                <p>
                    ₹${order.totalAmount}
                </p>


                <h3>
                    Status
                </h3>

                <p>
                    ${order.status}
                </p>


                <h3>
                    Shipping Address
                </h3>

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

            </div>
        `;


    } catch (error) {

        console.error(error);

        orderDetails.innerHTML = `
            <p>
                Failed to load order details.
            </p>
        `;
    }
}


loadOrder();