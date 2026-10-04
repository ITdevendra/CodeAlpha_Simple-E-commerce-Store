const form =
    document.getElementById(
        "add-product-form"
    );

const message =
    document.getElementById(
        "product-message"
    );


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
// ADD PRODUCT
// =========================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        message.textContent =
            "Adding product...";


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
                                productData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Failed to add product";

                return;

            }


            message.textContent =
                "Product added successfully!";


            form.reset();


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

checkAdminAccess();