const adminProducts =
    document.getElementById(
        "admin-products"
    );

    const adminOrders =
    document.getElementById("admin-orders");
    async function loadAdminOrders() {

    try {

        const response =
            await fetch(
                "/api/orders/admin/all",
                {
                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load orders"
            );
        }


        displayAdminOrders(
            data.orders
        );


    } catch (error) {

        console.error(error);

        adminOrders.innerHTML = `
            <p>
                Failed to load orders.
            </p>
        `;
    }
}
function displayAdminOrders(orders) {

    adminOrders.innerHTML = "";


    if (orders.length === 0) {

        adminOrders.innerHTML = `
            <p>
                No orders found.
            </p>
        `;

        return;
    }


    orders.forEach(order => {

        const orderCard =
            document.createElement("div");


        orderCard.className =
            "admin-order-card";


        const orderDate =
            new Date(
                order.createdAt
            ).toLocaleString();


        let itemsHTML = "";


        order.items.forEach(item => {

            itemsHTML += `

                <div class="admin-order-item">

                    <span>
                        ${item.name}
                    </span>

                    <span>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </span>

                </div>

            `;
        });


        orderCard.innerHTML = `

            <div class="admin-order-header">

                <h3>
                    Order #${order._id}
                </h3>

                <select
    class="order-status-select"
    onchange="updateOrderStatus('${order._id}', this.value)"
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
        ${order.status === "Delivered" ? "selected" : ""}
    >
        Delivered
    </option>

    <option
        value="Cancelled"
        ${order.status === "Cancelled" ? "selected" : ""}
    >
        Cancelled
    </option>
</select>

            </div>


            <div class="admin-customer">

                <p>
                    <strong>
                        Customer:
                    </strong>

                    ${order.user.name}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>

                    ${order.user.email}
                </p>

            </div>


            <div class="admin-order-items">

                <h4>
                    Items
                </h4>

                ${itemsHTML}

            </div>


            <div class="admin-order-total">

                <strong>
                    Total:
                </strong>

                ₹${order.totalAmount}

            </div>


            <div class="admin-shipping">

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

            </div>


            <p class="admin-order-date">

                Ordered:
                ${orderDate}

            </p>

        `;


        adminOrders.appendChild(
            orderCard
        );

    });
}
async function updateOrderStatus(orderId, status) {

    try {

        const response = await fetch(
            `/api/orders/admin/${orderId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    status: status
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update order status"
            );

            return;
        }


        alert(
            "Order status updated successfully!"
        );


        // Refresh orders

        loadAdminOrders();


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while updating order status."
        );
    }
}
    async function loadAdminProducts() {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );
        }


        const products =
            await response.json();


        displayAdminProducts(products);


    } catch (error) {

        console.error(error);


        adminProducts.innerHTML = `
            <p>
                Failed to load products.
            </p>
        `;
    }
}
function displayAdminProducts(products) {

    adminProducts.innerHTML = "";


    if (products.length === 0) {

        adminProducts.innerHTML = `
            <p>
                No products available.
            </p>
        `;

        return;
    }


    products.forEach(product => {

        const productCard =
            document.createElement("div");


        productCard.className =
            "admin-product-card";


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >


            <div class="admin-product-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ${product.description}
                </p>

                <p>
                    Price:
                    ₹${product.price}
                </p>

                <p>
                    Category:
                    ${product.category}
                </p>

                <p>
                    Stock:
                    ${product.stock}
                </p>


                <div class="admin-product-actions">

    <button
        class="edit-product-button"
        onclick="editProduct('${product._id}')"
    >
        Edit
    </button>

    <button
        class="delete-product-button"
        onclick="deleteProduct('${product._id}')"
    >
        Delete
    </button>

</div>

            </div>

        `;


        adminProducts.appendChild(
            productCard
        );

    });
}
async function editProduct(productId) {

    try {

        const response =
            await fetch(
                `/api/products/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch product"
            );
        }


        const product =
            await response.json();


        showEditProductForm(product);


    } catch (error) {

        console.error(error);

        alert(
            "Failed to load product."
        );
    }
}

function showEditProductForm(product) {

    const existingForm =
        document.getElementById(
            "edit-product-form"
        );


    if (existingForm) {
        existingForm.remove();
    }


    const formContainer =
        document.createElement("div");


    formContainer.id =
        "edit-product-form";


    formContainer.innerHTML = `

        <div class="edit-form-box">

            <h3>
                Edit Product
            </h3>


            <form id="update-product-form">

                <div>

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="edit-name"
                        value="${product.name}"
                        required
                    >

                </div>


                <div>

                    <label>
                        Description
                    </label>

                    <textarea
                        id="edit-description"
                        required
                    >${product.description}</textarea>

                </div>


                <div>

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        id="edit-price"
                        value="${product.price}"
                        min="0"
                        required
                    >

                </div>


                <div>

                    <label>
                        Image URL
                    </label>

                    <input
                        type="text"
                        id="edit-image"
                        value="${product.image}"
                        required
                    >

                </div>


                <div>

                    <label>
                        Category
                    </label>

                    <input
                        type="text"
                        id="edit-category"
                        value="${product.category}"
                        required
                    >

                </div>


                <div>

                    <label>
                        Stock
                    </label>

                    <input
                        type="number"
                        id="edit-stock"
                        value="${product.stock}"
                        min="0"
                        required
                    >

                </div>


                <button type="submit">
                    Update Product
                </button>


                <button
                    type="button"
                    id="cancel-edit-button"
                >
                    Cancel
                </button>

            </form>

        </div>

    `;


    adminProducts.before(
        formContainer
    );


    document
        .getElementById(
            "update-product-form"
        )
        .addEventListener(
            "submit",
            (event) => {

                updateProduct(
                    event,
                    product._id
                );

            }
        );


    document
        .getElementById(
            "cancel-edit-button"
        )
        .addEventListener(
            "click",
            () => {

                formContainer.remove();

            }
        );
}
async function updateProduct(
    event,
    productId
) {

    event.preventDefault();


    const updatedProduct = {

        name:
            document.getElementById(
                "edit-name"
            ).value.trim(),

        description:
            document.getElementById(
                "edit-description"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "edit-price"
                ).value
            ),

        image:
            document.getElementById(
                "edit-image"
            ).value.trim(),

        category:
            document.getElementById(
                "edit-category"
            ).value.trim(),

        stock:
            Number(
                document.getElementById(
                    "edit-stock"
                ).value
            )
    };


    try {

        const response =
            await fetch(
                `/api/products/${productId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body:
                        JSON.stringify(
                            updatedProduct
                        )
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update product"
            );

            return;
        }


        alert(
            "Product updated successfully!"
        );


        // Remove edit form

        const editForm =
            document.getElementById(
                "edit-product-form"
            );


        if (editForm) {
            editForm.remove();
        }


        // Refresh product list

        loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong."
        );
    }
}
async function deleteProduct(productId) {

    const confirmed = confirm(
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


        // Refresh product list

        loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while deleting the product."
        );
    }
}

const addProductButton =
    document.getElementById(
        "add-product-button"
    );

const productFormContainer =
    document.getElementById(
        "product-form-container"
    );

const productForm =
    document.getElementById(
        "product-form"
    );

const cancelProductButton =
    document.getElementById(
        "cancel-product-button"
    );

const productMessage =
    document.getElementById(
        "product-message"
    );

    // =========================
// SHOW ADD PRODUCT FORM
// =========================

addProductButton.addEventListener(
    "click",
    () => {

        productFormContainer.style.display =
            "block";

        productMessage.textContent =
            "";
    }
);


// =========================
// HIDE ADD PRODUCT FORM
// =========================

cancelProductButton.addEventListener(
    "click",
    () => {

        productFormContainer.style.display =
            "none";

        productForm.reset();

        productMessage.textContent =
            "";
    }
);


// =========================
// CREATE PRODUCT
// =========================

productForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const product = {

            name:
                document.getElementById(
                    "product-name"
                ).value.trim(),

            description:
                document.getElementById(
                    "product-description"
                ).value.trim(),

            price:
                Number(
                    document.getElementById(
                        "product-price"
                    ).value
                ),

            image:
                document.getElementById(
                    "product-image"
                ).value.trim(),

            category:
                document.getElementById(
                    "product-category"
                ).value.trim(),

            stock:
                Number(
                    document.getElementById(
                        "product-stock"
                    ).value
                )
        };


        try {

            const response =
                await fetch(
                    "/api/products",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body:
                            JSON.stringify(
                                product
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                productMessage.textContent =
                    data.message ||
                    "Failed to create product";

                return;
            }


            productMessage.textContent =
                "Product created successfully!";


            productForm.reset();


            setTimeout(() => {

                productFormContainer.style.display =
                    "none";

                productMessage.textContent =
                    "";

            }, 1500);


        } catch (error) {

            console.error(error);

            productMessage.textContent =
                "Something went wrong.";
        }
    }
);

const adminWelcome =
    document.getElementById(
        "admin-welcome"
    );

const adminContent =
    document.getElementById(
        "admin-content"
    );

const logoutButton =
    document.getElementById(
        "admin-logout"
    );


// =========================
// CHECK ADMIN AUTH
// =========================

async function checkAdminAccess() {

    try {

        const response =
            await fetch(
                "/api/auth/admin-test",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            adminWelcome.textContent =
                "Access denied.";

            setTimeout(() => {

                window.location.href =
                    "/";

            }, 1500);

            return;
        }


        const data =
            await response.json();


        adminWelcome.textContent =
            `Welcome, ${data.admin.name}`;


        adminContent.style.display =
            "block";


    } catch (error) {

        console.error(error);


        adminWelcome.textContent =
            "Unable to verify admin access.";

    }
}


// =========================
// LOGOUT
// =========================

async function logoutAdmin() {

    try {

        const response =
            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


        if (response.ok) {

            window.location.href =
                "/";

        }

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );
    }
}


logoutButton.addEventListener(
    "click",
    logoutAdmin
);


// Start
checkAdminAccess();
loadAdminProducts();
loadAdminOrders();

