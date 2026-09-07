const registerForm = document.getElementById("register-form");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
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

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1000);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";
    }
});