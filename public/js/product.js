const productDetails = document.getElementById("product-details");

let currentProduct = null;

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {

    if (!productId) {
        productDetails.innerHTML = "<p>Product ID is missing.</p>";
        return;
    }

    try {

        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();
        currentProduct = product;
        displayProduct(product);

    } catch (error) {

        console.error(error);

        productDetails.innerHTML = `
            <p>Unable to load product.</p>
        `;
    }
}

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

                <p>${product.category}</p>

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <h3>₹${product.price}</h3>

                <p>Available stock: ${product.stock}</p>

                <label for="quantity">
                    Quantity:
                </label>

                <input 
                    type="number"
                    id="quantity"
                    value="1"
                    min="1"
                    max="${product.stock}"
                >

                <br>

                <button onclick="addToCart('${product._id}')">
                    Add to Cart
                </button>

            </div>

        </div>
    `;
}

function addToCart(productId) {

    const quantity = Number(
        document.getElementById("quantity").value
    );

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += quantity;

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
        "cart",
        JSON.stringify(cart)
    );

    alert("Product added to cart!");

    window.location.href = "/cart.html";
}

loadProduct();