const medicineForm = document.getElementById("medicineForm");
const medicineTableBody = document.getElementById("medicineTableBody");

const stockForm = document.getElementById("stockForm");
const stockTableBody = document.getElementById("stockTableBody");

const transferForm = document.getElementById("transferForm");
const transferTableBody = document.getElementById("transferTableBody");

const API_URL = "http://localhost:3000/api";


medicineForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const medicine = {
        medicineName: document.getElementById("medicineName").value,
        dosage: document.getElementById("dosage").value,
        quantity: document.getElementById("quantity").value,
        reminderTime: document.getElementById("reminderTime").value
    };

    const response = await fetch(`${API_URL}/medicines`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medicine)
    });

    const data = await response.json();

    alert(data.message);

    medicineForm.reset();

    loadMedicines();
});


async function loadMedicines() {
    const response = await fetch(`${API_URL}/medicines`);
    const medicines = await response.json();

    if (medicines.length === 0) {
        medicineTableBody.innerHTML = `
            <tr>
                <td colspan="4">No medicines added yet.</td>
            </tr>
        `;
        return;
    }

    medicineTableBody.innerHTML = medicines.map(medicine => `
        <tr>
            <td>${medicine.medicineName}</td>
            <td>${medicine.dosage}</td>
            <td>${medicine.quantity}</td>
            <td>${medicine.reminderTime}</td>
        </tr>
    `).join("");
}


stockForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const quantity = Number(document.getElementById("stockQuantity").value);

    let status;

    if (quantity === 0) {
        status = "Out of Stock";
    } else if (quantity <= 10) {
        status = "Low Stock";
    } else {
        status = "Available";
    }

    const stockItem = {
        medicine: document.getElementById("stockMedicine").value,
        branch: document.getElementById("branch").value,
        quantity: quantity,
        status: status
    };

    const response = await fetch(`${API_URL}/stock`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(stockItem)
    });

    const data = await response.json();

    alert(data.message);

    stockForm.reset();

    loadStock();
});


async function loadStock() {
    const response = await fetch(`${API_URL}/stock`);
    const stock = await response.json();

    if (stock.length === 0) {
        stockTableBody.innerHTML = `
            <tr>
                <td colspan="4">No stock records available.</td>
            </tr>
        `;
        return;
    }

    stockTableBody.innerHTML = stock.map(item => `
        <tr>
            <td>${item.medicine}</td>
            <td>${item.branch}</td>
            <td>${item.quantity}</td>
            <td>${item.status}</td>
        </tr>
    `).join("");
}


transferForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fromBranch = document.getElementById("fromBranch").value;
    const toBranch = document.getElementById("toBranch").value;

    if (fromBranch === toBranch) {
        alert("From Branch and To Branch cannot be the same.");
        return;
    }

    const transfer = {
        fromBranch: fromBranch,
        toBranch: toBranch,
        medicine: document.getElementById("transferMedicine").value,
        quantity: Number(document.getElementById("transferQuantity").value)
    };

    const response = await fetch(`${API_URL}/transfers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transfer)
    });

    const data = await response.json();

    alert(data.message);

    transferForm.reset();

    loadTransfers();
});


async function loadTransfers() {
    const response = await fetch(`${API_URL}/transfers`);
    const transfers = await response.json();

    if (transfers.length === 0) {
        transferTableBody.innerHTML = `
            <tr>
                <td colspan="4">No transfers made yet.</td>
            </tr>
        `;
        return;
    }

    transferTableBody.innerHTML = transfers.map(transfer => `
        <tr>
            <td>${transfer.medicine}</td>
            <td>${transfer.fromBranch}</td>
            <td>${transfer.toBranch}</td>
            <td>${transfer.quantity}</td>
        </tr>
    `).join("");
}


loadMedicines();
loadStock();
loadTransfers();