const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
}

function goToAddCompany() {
    window.location.href = "add-company.html";
}

async function fetchCompanies() {
    try {
        const res = await fetch("http://localhost:5001/admin/companies", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const companies = await res.json();
        const tableBody = document.getElementById("companyTableBody");
        tableBody.innerHTML = "";

        companies.forEach(c => {
            const row = `
                <tr>
                    <td>${c.name}</td>
                    <td>${c.email}</td>
                    <td>${c.phone}</td>
                    <td>${c.address}</td>
                    <td>${c.status}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (err) {
        alert("Failed to load companies");
        console.error(err);
    }
}

fetchCompanies();
