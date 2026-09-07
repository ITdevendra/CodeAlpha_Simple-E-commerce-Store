const cartContainer = document.getElementById("cart-container");

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>

            <a href="/">
                Continue Shopping
            </a>
        `;

        return;
    }

    let total = 0;

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>₹${item.price}</p>

                <div>
                    <button onclick="decreaseQuantity('${item.id}')">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity('${item.id}')">
                        +
                    </button>
                </div>

                <p>
                    Subtotal: ₹${itemTotal}
                </p>

                <button onclick="removeFromCart('${item.id}')">
                    Remove
                </button>

            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    const totalElement = document.createElement("div");

    totalElement.classList.add("cart-total");

    totalElement.innerHTML = `
        <h2>Total: ₹${total}</h2>

        <button onclick="checkout()">
            Checkout
        </button>
    `;

    cartContainer.appendChild(totalElement);
}


function increaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity++;
    }

    saveCart(cart);

    displayCart();
}


function decreaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(item => item.id === productId);

    if (item) {

        item.quantity--;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart(cart);

    displayCart();
}


function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(item => item.id !== productId);

    saveCart(cart);

    displayCart();
}


function checkout() {

    alert("Checkout functionality will be added later.");
}


displayCart();