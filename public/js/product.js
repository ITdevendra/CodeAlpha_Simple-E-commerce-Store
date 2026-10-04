const productDetails =
    document.getElementById("product-details");

let currentProduct = null;


// Get product ID from URL
const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");


// =========================
// GET CURRENT USER
// =========================

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
            "Failed to get user:",
            error
        );

        return null;
    }
}


// =========================
// LOAD PRODUCT
// =========================

async function loadProduct() {

    if (!productId) {

        productDetails.innerHTML =
            "<p>Product ID is missing.</p>";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/products/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );
        }


        const product =
            await response.json();


        currentProduct =
            product;


        displayProduct(product);


    } catch (error) {

        console.error(error);


        productDetails.innerHTML = `
            <p>
                Unable to load product.
            </p>
        `;
    }
}


// =========================
// DISPLAY PRODUCT
// =========================

function displayProduct(product) {

    productDetails.innerHTML = `

        <div class="product-detail">

            <div>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div>

                <p>
                    ${product.category}
                </p>


                <h2>
                    ${product.name}
                </h2>


                <p>
                    ${product.description}
                </p>


                <h3>
                    ₹${product.price}
                </h3>


                <p>
                    Available stock:
                    ${product.stock}
                </p>


                <label for="quantity">
                    Quantity:
                </label>


                <input
                    type="number"
                    id="quantity"
                    value="1"
                    min="1"
                    max="${product.stock}"
                    ${product.stock === 0 ? "disabled" : ""}
                >


                <br>


                <button
                    onclick="addToCart('${product._id}')"
                    ${product.stock === 0 ? "disabled" : ""}
                >
                    ${
                        product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"
                    }
                </button>

            </div>

        </div>
    `;
}


// =========================
// ADD TO CART
// =========================

async function addToCart(productId) {

    const user =
        await getCurrentUser();


    // User must be logged in
    if (!user) {

        alert(
            "Please login to add products to cart."
        );

        window.location.href =
            "/login.html";

        return;
    }


    const quantityInput =
        document.getElementById(
            "quantity"
        );


    const quantity =
        Number(quantityInput.value);


    // Validate quantity
    if (
        !quantity ||
        quantity < 1
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;
    }


    // Check stock
    if (
        quantity >
        currentProduct.stock
    ) {

        alert(
            `Only ${currentProduct.stock} item(s) available.`
        );

        return;
    }


    // User-specific cart key
    const cartKey =
        `cart_${user._id}`;


    const cart =
        JSON.parse(
            localStorage.getItem(cartKey)
        ) || [];


    // Check existing product
    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        if (
            existingItem.quantity +
            quantity >
            currentProduct.stock
        ) {

            alert(
                `Only ${currentProduct.stock} item(s) available in total.`
            );

            return;
        }


        existingItem.quantity +=
            quantity;

    } else {

        cart.push({

            id: currentProduct._id,

            name: currentProduct.name,

            price: currentProduct.price,

            image: currentProduct.image,

            quantity: quantity

        });
    }


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    alert(
        "Product added to cart!"
    );


    window.location.href =
        "/cart.html";
}


loadProduct();