let allProducts = [];

const productsContainer =
    document.getElementById("product-container");

const searchInput =
    document.getElementById("search-input");

const categoryFilter =
    document.getElementById("category-filter");

const sortProducts =
    document.getElementById("sort-products");


// Get products from backend
async function loadProducts() {

    try {

        const response = await fetch(
            "/api/products"
        );

        const products = await response.json();

        allProducts = products;

        createCategoryOptions(products);

        displayProducts(products);

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <p>
                Failed to load products.
            </p>
        `;
    }
}


// Create category dropdown
function createCategoryOptions(products) {

    const categories =
        [...new Set(
            products.map(product => product.category)
        )];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });
}


// Display products
function displayProducts(products) {

    productsContainer.innerHTML = "";


    if (products.length === 0) {

        productsContainer.innerHTML = `
            <p>
                No products found.
            </p>
        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.description}
            </p>

            <p>
                ₹${product.price}
            </p>

            <p>
                Stock: ${product.stock}
            </p>

            <button
                onclick="viewProduct('${product._id}')"
            >
                View Details
            </button>

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

        `;


        productsContainer.appendChild(card);

    });
}


// Filter and sort products
function updateProducts() {

    let filteredProducts =
        [...allProducts];


    // Search
    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchTerm) {

        filteredProducts =
            filteredProducts.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(searchTerm)

            );

    }


    // Category filter
    const selectedCategory =
        categoryFilter.value;


    if (selectedCategory !== "all") {

        filteredProducts =
            filteredProducts.filter(product =>

                product.category === selectedCategory

            );

    }


    // Sorting
    const sortValue =
        sortProducts.value;


    if (sortValue === "price-low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortValue === "price-high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    displayProducts(filteredProducts);
}


// Event listeners
searchInput.addEventListener(
    "input",
    updateProducts
);

categoryFilter.addEventListener(
    "change",
    updateProducts
);

sortProducts.addEventListener(
    "change",
    updateProducts
);


// Open product details
function viewProduct(id) {

    window.location.href =
        `/product.html?id=${id}`;

}

// =========================
// ADD TO CART FROM HOME
// =========================

async function addToCart(productId) {

    try {

        // Check logged-in user
        const response =
            await fetch(
                "/api/auth/me",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            alert(
                "Please login to add products to cart."
            );

            window.location.href =
                "/login.html";

            return;
        }


        const data =
            await response.json();


        const user =
            data.user;


        // Get product
        const productResponse =
            await fetch(
                `/api/products/${productId}`
            );


        if (!productResponse.ok) {

            alert(
                "Product not found."
            );

            return;
        }


        const product =
            await productResponse.json();


        // User-specific cart
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
                existingItem.quantity >=
                product.stock
            ) {

                alert(
                    `Only ${product.stock} item(s) available.`
                );

                return;
            }


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


        localStorage.setItem(
            cartKey,
            JSON.stringify(cart)
        );


        alert(
            "Product added to cart!"
        );


    } catch (error) {

        console.error(
            "Add to cart failed:",
            error
        );

        alert(
            "Unable to add product to cart."
        );
    }
}

// Start
loadProducts();