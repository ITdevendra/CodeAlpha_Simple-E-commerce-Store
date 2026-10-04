const checkoutForm =
    document.getElementById("checkout-form");

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");

const checkoutMessage =
    document.getElementById("checkout-message");


// =========================
// CURRENT USER
// =========================

let currentUser = null;


// =========================
// CHECK AUTHENTICATION
// =========================

async function checkAuthentication() {

    try {

        const response = await fetch(
            "/api/auth/me",
            {
                credentials: "include"
            }
        );


        if (!response.ok) {

            alert(
                "Please login before checkout."
            );

            window.location.href =
                "/login.html";

            return false;
        }


        const data =
            await response.json();


        currentUser =
            data.user;


        return true;


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        window.location.href =
            "/login.html";


        return false;
    }

}


// =========================
// GET USER-SPECIFIC CART
// =========================

function getCart() {

    if (!currentUser) {
        return [];
    }


    const cartKey =
        `cart_${currentUser._id}`;


    return JSON.parse(
        localStorage.getItem(cartKey)
    ) || [];

}


// =========================
// DISPLAY CHECKOUT SUMMARY
// =========================

function displayCheckoutSummary() {

    const cart =
        getCart();


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>
                Your cart is empty.
            </p>

            <a href="/cart.html">
                Go back to cart
            </a>
        `;


        checkoutTotal.textContent =
            "Total: ₹0";


        checkoutForm.style.display =
            "none";


        return;
    }


    let total = 0;


    checkoutItems.innerHTML =
        "";


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        total += itemTotal;


        const element =
            document.createElement("div");


        element.innerHTML = `
            <p>
                ${item.name}
                × ${item.quantity}
                = ₹${itemTotal}
            </p>
        `;


        checkoutItems.appendChild(
            element
        );

    });


    checkoutTotal.textContent =
        `Total: ₹${total}`;

}


// =========================
// SUBMIT ORDER
// =========================

checkoutForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        checkoutMessage.textContent =
            "";


        const cart =
            getCart();


        if (cart.length === 0) {

            checkoutMessage.textContent =
                "Your cart is empty.";

            return;
        }


        // =========================
        // SHIPPING ADDRESS
        // =========================

        const shippingAddress = {

            fullName:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            address:
                document
                    .getElementById("address")
                    .value
                    .trim(),

            city:
                document
                    .getElementById("city")
                    .value
                    .trim(),

            pincode:
                document
                    .getElementById("pincode")
                    .value
                    .trim()

        };


        // =========================
        // SEND ONLY PRODUCT ID
        // AND QUANTITY
        // =========================

        const orderItems =
            cart.map(item => ({

                product: item.id,

                quantity: item.quantity

            }));


        try {

            const response =
                await fetch(
                    "/api/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            items: orderItems,

                            shippingAddress

                        })

                    }
                );


            const data =
                await response.json();


            // =========================
            // ORDER FAILED
            // =========================

            if (!response.ok) {

                checkoutMessage.textContent =
                    data.message ||
                    "Failed to place order.";

                return;
            }


            // =========================
            // ORDER SUCCESS
            // =========================

            const cartKey =
                `cart_${currentUser._id}`;


            localStorage.removeItem(
                cartKey
            );


            alert(
                "Order placed successfully!"
            );


            window.location.href =
                `/order-success.html?id=${data.order._id}`;


        } catch (error) {

            console.error(
                "Order creation failed:",
                error
            );


            checkoutMessage.textContent =
                "Something went wrong. Please try again.";

        }

    }
);


// =========================
// INITIALIZE CHECKOUT
// =========================

async function initializeCheckout() {

    const isAuthenticated =
        await checkAuthentication();


    if (!isAuthenticated) {
        return;
    }


    displayCheckoutSummary();

}


initializeCheckout();