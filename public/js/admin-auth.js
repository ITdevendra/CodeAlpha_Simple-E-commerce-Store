const logoutButton =
    document.getElementById("logout-button");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

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
                        "/login.html";

                } else {

                    alert(
                        "Logout failed."
                    );

                }

            } catch (error) {

                console.error(error);

                alert(
                    "Logout failed."
                );

            }

        }
    );

}