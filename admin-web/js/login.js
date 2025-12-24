const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5001/admin/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMsg.textContent = data.message || "Login failed";
            return;
        }

        // ✅ Your backend sends only `token`
        localStorage.setItem("adminToken", data.token);

        // ✅ Redirect after login
        window.location.href = "dashboard.html";

    } catch (err) {
        errorMsg.textContent = "Backend not reachable";
    }
});
