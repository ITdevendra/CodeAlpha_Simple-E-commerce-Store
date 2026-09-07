const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        message.textContent = data.message;

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";
    }
});