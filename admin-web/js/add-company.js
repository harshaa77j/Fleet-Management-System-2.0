const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("companyForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };

    try {
        const res = await fetch("http://localhost:5001/admin/companies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            alert(result.message || "Failed to create company");
            return;
        }

        // Show activation key
        // document.getElementById("successBox").style.display = "block";
        // document.getElementById("activationKey").innerText =
        //     result.activationKey?.key || "Not received";

        if (result.activationKey) {
            document.getElementById("successBox").style.display = "block";
            document.getElementById("activationKey").innerText = result.activationKey;
        } else {
            alert("Company created but activation key missing");
        }   


        document.getElementById("companyForm").reset();

    } catch (err) {
        alert("Server error");
        console.error(err);
    }
});

function goBack() {
    window.location.href = "dashboard.html";
}
