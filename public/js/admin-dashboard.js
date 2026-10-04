const totalProducts =
    document.getElementById(
        "total-products"
    );

const totalOrders =
    document.getElementById(
        "total-orders"
    );

const totalUsers =
    document.getElementById(
        "total-users"
    );

const totalRevenue =
    document.getElementById(
        "total-revenue"
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
// LOAD DASHBOARD DATA
// =========================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                "/api/admin/dashboard",
                {
                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to load dashboard"
            );

            return;

        }


        totalProducts.textContent =
            data.totalProducts;


        totalOrders.textContent =
            data.totalOrders;


        totalUsers.textContent =
            data.totalUsers;


        totalRevenue.textContent =
            `₹${data.totalRevenue}`;


    } catch (error) {

        console.error(error);

        alert(
            "Failed to load dashboard."
        );

    }

}


// =========================
// INITIALIZE
// =========================

async function initializeDashboard() {

    const isAdmin =
        await checkAdminAccess();


    if (!isAdmin) {

        return;

    }


    await loadDashboard();

}


initializeDashboard();