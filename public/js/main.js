const productContainer = document.getElementById("product-container");

let products = [];

async function loadProducts() {
    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error("Error:", error);

        productContainer.innerHTML = `
            <p>Unable to load products.</p>
        `;
    }
}

function displayProducts(products) {
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = `
            <p>No products available.</p>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement("div");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img 
                src="${product.image}" 
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <p class="price">₹${product.price}</p>

            <p>Stock: ${product.stock}</p>

            <button onclick="viewProduct('${product._id}')">
                View Details
            </button>

            <button onclick="addToCart('${product._id}')">
                Add to Cart
            </button>
        `;

        productContainer.appendChild(productCard);
    });
}

function viewProduct(productId) {
    window.location.href = `/product.html?id=${productId}`;
}

function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find the product that was clicked
    const product = products.find(product => product._id === productId);

    if (!product) {
        console.error("Product not found");
        return;
    }

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
}

loadProducts();