const productsList =
    document.getElementById(
        "admin-products-list"
    );

const productsMessage =
    document.getElementById(
        "products-message"
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

            window.location.href =
                "/login.html";

            return false;

        }


        const data =
            await response.json();


        if (
            !data.user ||
            data.user.role !== "admin"
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

        console.error(error);

        window.location.href =
            "/login.html";

        return false;

    }

}


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        const products =
            await response.json();


        if (!response.ok) {

            productsMessage.textContent =
                products.message ||
                "Failed to load products";

            return;

        }


        productsMessage.textContent =
            "";


        if (products.length === 0) {

            productsList.innerHTML = `
                <p>
                    No products found.
                </p>
            `;

            return;

        }


        productsList.innerHTML = "";


        products.forEach(product => {

            const productCard =
                document.createElement(
                    "div"
                );


            productCard.className =
                "admin-product-card";


            productCard.innerHTML = `

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
                    <strong>
                        Category:
                    </strong>

                    ${product.category}
                </p>


                <p>
                    <strong>
                        Price:
                    </strong>

                    ₹${product.price}
                </p>


                <p>
                    <strong>
                        Stock:
                    </strong>

                    ${product.stock}
                </p>


                <div class="admin-product-actions">

                    <a
                        href="/product.html?id=${product._id}"
                    >
                        View
                    </a>


                    <a
                        href="/admin-edit-product.html?id=${product._id}"
                    >
                        Edit
                    </a>


                    <button
                        onclick="deleteProduct('${product._id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            productsList.appendChild(
                productCard
            );

        });


    } catch (error) {

        console.error(error);


        productsMessage.textContent =
            "Failed to load products.";

    }

}


// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(productId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/products/${productId}`,
                {
                    method: "DELETE",

                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete product"
            );

            return;

        }


        alert(
            "Product deleted successfully!"
        );


        // Reload product list

        await loadProducts();


    } catch (error) {

        console.error(error);


        alert(
            "Something went wrong while deleting the product."
        );

    }

}


// =========================
// INITIALIZE
// =========================

async function initializeAdminProducts() {

    const isAdmin =
        await checkAdminAccess();


    if (!isAdmin) {

        return;

    }


    await loadProducts();

}


initializeAdminProducts();