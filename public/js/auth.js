const navbar = document.getElementById("navbar");

async function checkLoginStatus() {
    try {
        const response = await fetch("/api/auth/me", {
            credentials: "include"
        });

        if (!response.ok) {
            showLoggedOutNavbar();
            return;
        }

        const data = await response.json();

        showLoggedInNavbar(data.user);

    } catch (error) {
        console.error("Authentication check failed:", error);
        showLoggedOutNavbar();
    }
}


function showLoggedOutNavbar() {

    navbar.innerHTML = `
        <a href="/">Home</a>
        <a href="/cart.html">Cart</a>
        <a href="/login.html">Login</a>
        <a href="/register.html">Register</a>
    `;
}


function showLoggedInNavbar(user) {

    navbar.innerHTML = `
        <a href="/">Home</a>

        <a href="/cart.html">
            Cart
        </a>

        <a href="/orders.html">
            My Orders
        </a>

        <span class="user-greeting">
            Hi, ${user.name}
        </span>

        <button id="logout-button">
            Logout
        </button>
    `;


    document
        .getElementById("logout-button")
        .addEventListener(
            "click",
            logout
        );
}


async function logout() {

    try {

        const response = await fetch(
            "/api/auth/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Logout failed."
            );

            return;
        }


        window.location.href = "/";


    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        alert(
            "Unable to logout. Please try again."
        );
    }
}


if (navbar) {
    checkLoginStatus();
}