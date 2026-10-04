const form =
    document.getElementById(
        "edit-product-form"
    );

const message =
    document.getElementById(
        "product-message"
    );


// =========================
// GET PRODUCT ID
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");


// =========================
// CHECK ADMIN
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
// LOAD PRODUCT
// =========================

async function loadProduct() {

    if (!productId) {

        message.textContent =
            "Product ID is missing.";

        return;

    }


    try {

        const response =
            await fetch(
                `/api/products/${productId}`
            );


        const product =
            await response.json();


        if (!response.ok) {

            message.textContent =
                product.message ||
                "Product not found.";

            return;

        }


        document.getElementById(
            "name"
        ).value = product.name;


        document.getElementById(
            "description"
        ).value = product.description;


        document.getElementById(
            "price"
        ).value = product.price;


        document.getElementById(
            "image"
        ).value = product.image;


        document.getElementById(
            "category"
        ).value = product.category;


        document.getElementById(
            "stock"
        ).value = product.stock;


    } catch (error) {

        console.error(error);


        message.textContent =
            "Failed to load product.";

    }

}


// =========================
// UPDATE PRODUCT
// =========================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!productId) {

            message.textContent =
                "Product ID is missing.";

            return;

        }


        message.textContent =
            "Updating product...";


        const productData = {

            name:
                document.getElementById(
                    "name"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim(),

            price:
                Number(
                    document.getElementById(
                        "price"
                    ).value
                ),

            image:
                document.getElementById(
                    "image"
                ).value.trim(),

            category:
                document.getElementById(
                    "category"
                ).value.trim(),

            stock:
                Number(
                    document.getElementById(
                        "stock"
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
                                productData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Failed to update product";

                return;

            }


            message.textContent =
                "Product updated successfully!";


            setTimeout(() => {

                window.location.href =
                    "/admin-products.html";

            }, 1000);


        } catch (error) {

            console.error(error);


            message.textContent =
                "Something went wrong.";

        }

    }
);


// =========================
// INITIALIZE
// =========================

async function initialize() {

    const isAdmin =
        await checkAdminAccess();


    if (!isAdmin) {
        return;
    }


    await loadProduct();

}


initialize();