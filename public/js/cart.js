let currentUser = null;
async function getCurrentUser() {

    try {

        const response =
            await fetch(
                "/api/auth/me",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {
            return null;
        }


        const data =
            await response.json();


        return data.user;


    } catch (error) {

        console.error(
            "Failed to get current user:",
            error
        );

        return null;
    }

}
const cartContainer =
    document.getElementById("cart-container");


// =========================
// GET CART
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
// SAVE CART
// =========================

function saveCart(cart) {

    if (!currentUser) {
        return;
    }


    const cartKey =
        `cart_${currentUser._id}`;


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );

}


// =========================
// LOAD CURRENT PRODUCT DATA
// =========================

async function getProduct(productId) {

    try {

        const response =
            await fetch(
                `/api/products/${productId}`
            );


        if (!response.ok) {
            return null;
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Failed to get product:",
            error
        );

        return null;
    }

}


// =========================
// CHECK CART STOCK
// =========================

async function validateCartStock() {

    const cart = getCart();


    if (cart.length === 0) {
        return;
    }


    let cartChanged = false;


    for (const item of cart) {

        const product =
            await getProduct(item.id);


        // Product no longer exists

        if (!product) {

            item.stock = 0;

            cartChanged = true;

            continue;
        }


        // Update current product information

        item.name =
            product.name;

        item.price =
            product.price;

        item.image =
            product.image;

        item.stock =
            product.stock;


        // Cart quantity is greater than stock

        if (
            item.quantity >
            product.stock
        ) {

            item.quantity =
                product.stock;

            cartChanged = true;
        }


        // Product is completely out of stock

        if (
            product.stock === 0
        ) {

            item.quantity = 0;

            cartChanged = true;
        }

    }


    // Remove items with zero quantity

    const validCart =
        cart.filter(
            item => item.quantity > 0
        );


    if (
        validCart.length !==
        cart.length
    ) {

        cartChanged = true;
    }


    if (cartChanged) {

        saveCart(validCart);
    }

}


// =========================
// DISPLAY CART
// =========================

async function displayCart() {

    cartContainer.innerHTML = `
        <p>
            Checking product availability...
        </p>
    `;


    await validateCartStock();


    const cart = getCart();


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>
                Your cart is empty.
            </p>

            <a href="/">
                Continue Shopping
            </a>
        `;

        return;
    }


    let total = 0;


    cartContainer.innerHTML = "";


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");


        cartItem.classList.add(
            "cart-item"
        );


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>


                <p>
                    ₹${item.price}
                </p>


                <p>
                    Available stock:
                    ${item.stock}
                </p>


                <div>

                    <button
                        onclick="decreaseQuantity('${item.id}')"
                    >
                        -
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="increaseQuantity('${item.id}')"
                        ${
                            item.quantity >= item.stock
                                ? "disabled"
                                : ""
                        }
                    >
                        +
                    </button>

                </div>


                <p>
                    Subtotal:
                    ₹${itemTotal}
                </p>


                <button
                    onclick="removeFromCart('${item.id}')"
                >
                    Remove
                </button>

            </div>

        `;


        cartContainer.appendChild(
            cartItem
        );

    });


    // =========================
    // CART TOTAL
    // =========================

    const totalElement =
        document.createElement("div");


    totalElement.classList.add(
        "cart-total"
    );


    totalElement.innerHTML = `

        <h2>
            Total:
            ₹${total}
        </h2>


        <button
            onclick="checkout()"
        >
            Checkout
        </button>

    `;


    cartContainer.appendChild(
        totalElement
    );

}


// =========================
// INCREASE QUANTITY
// =========================

async function increaseQuantity(
    productId
) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) {
        return;
    }


    const product =
        await getProduct(productId);


    if (!product) {

        alert(
            "Product is no longer available."
        );

        removeFromCart(productId);

        return;
    }


    if (
        item.quantity >=
        product.stock
    ) {

        alert(
            `Only ${product.stock} item(s) available in stock.`
        );

        return;
    }


    item.quantity++;


    item.stock =
        product.stock;


    saveCart(cart);


    displayCart();

}


// =========================
// DECREASE QUANTITY
// =========================

function decreaseQuantity(
    productId
) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (
        item.quantity <= 0
    ) {

        removeFromCart(productId);

        return;
    }


    saveCart(cart);


    displayCart();

}


// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(
    productId
) {

    let cart = getCart();


    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart(cart);


    displayCart();

}


// =========================
// CHECKOUT
// =========================

function checkout() {

    const cart = getCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    window.location.href =
        "/checkout.html";

}


// =========================
// DISPLAY CART
// =========================

async function initializeCart() {

    currentUser =
        await getCurrentUser();


    if (!currentUser) {

        cartContainer.innerHTML = `

            <p>
                Please login to view your cart.
            </p>

            <a href="/login.html">
                Login
            </a>

        `;

        return;
    }


    displayCart();

}


initializeCart();