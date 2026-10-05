const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let medicines = [];
let stock = [];
let transfers = [];

app.get("/", (req, res) => {
    res.json({
        message: "Medicine Reminder and Stock Transfer System API is running"
    });
});

app.get("/api/medicines", (req, res) => {
    res.json(medicines);
});

app.post("/api/medicines", (req, res) => {
    const { medicineName, dosage, quantity, reminderTime } = req.body;

    if (!medicineName || !dosage || !quantity || !reminderTime) {
        return res.status(400).json({
            message: "All medicine fields are required"
        });
    }

    if (Number(quantity) <= 0) {
        return res.status(400).json({
            message: "Medicine quantity must be greater than 0"
        });
    }

    const medicine = {
        medicineName,
        dosage,
        quantity: Number(quantity),
        reminderTime
    };

    medicines.push(medicine);

    res.status(201).json({
        message: "Medicine added successfully",
        medicine
    });
});

app.get("/api/stock", (req, res) => {
    res.json(stock);
});

app.post("/api/stock", (req, res) => {
    const { medicine, branch, quantity } = req.body;

    if (!medicine || !branch || quantity === undefined) {
        return res.status(400).json({
            message: "All stock fields are required"
        });
    }

    if (Number(quantity) < 0) {
        return res.status(400).json({
            message: "Stock quantity cannot be negative"
        });
    }

    const stockQuantity = Number(quantity);

    let status;

    if (stockQuantity === 0) {
        status = "Out of Stock";
    } else if (stockQuantity <= 10) {
        status = "Low Stock";
    } else {
        status = "Available";
    }

    const stockItem = {
        medicine,
        branch,
        quantity: stockQuantity,
        status
    };

    stock.push(stockItem);

    res.status(201).json({
        message: "Stock added successfully",
        stock: stockItem
    });
});

app.get("/api/transfers", (req, res) => {
    res.json(transfers);
});

app.post("/api/transfers", (req, res) => {
    const { fromBranch, toBranch, medicine, quantity } = req.body;

    if (!fromBranch || !toBranch || !medicine || quantity === undefined) {
        return res.status(400).json({
            message: "All transfer fields are required"
        });
    }

    if (fromBranch === toBranch) {
        return res.status(400).json({
            message: "From Branch and To Branch cannot be the same"
        });
    }

    if (Number(quantity) <= 0) {
        return res.status(400).json({
            message: "Transfer quantity must be greater than 0"
        });
    }

    const sourceStock = stock.find(
        item =>
            item.medicine.toLowerCase() === medicine.toLowerCase() &&
            item.branch.toLowerCase() === fromBranch.toLowerCase()
    );

    if (!sourceStock) {
        return res.status(400).json({
            message: "Medicine is not available in the source branch"
        });
    }

    if (sourceStock.quantity < Number(quantity)) {
        return res.status(400).json({
            message: `Insufficient stock. Available quantity: ${sourceStock.quantity}`
        });
    }

    sourceStock.quantity -= Number(quantity);

    if (sourceStock.quantity === 0) {
        sourceStock.status = "Out of Stock";
    } else if (sourceStock.quantity <= 10) {
        sourceStock.status = "Low Stock";
    } else {
        sourceStock.status = "Available";
    }

    const destinationStock = stock.find(
        item =>
            item.medicine.toLowerCase() === medicine.toLowerCase() &&
            item.branch.toLowerCase() === toBranch.toLowerCase()
    );

    if (destinationStock) {
        destinationStock.quantity += Number(quantity);

        if (destinationStock.quantity <= 10) {
            destinationStock.status = "Low Stock";
        } else {
            destinationStock.status = "Available";
        }
    } else {
        stock.push({
            medicine,
            branch: toBranch,
            quantity: Number(quantity),
            status: Number(quantity) <= 10 ? "Low Stock" : "Available"
        });
    }

    const transfer = {
        fromBranch,
        toBranch,
        medicine,
        quantity: Number(quantity)
    };

    transfers.push(transfer);

    res.status(201).json({
        message: "Stock transfer completed successfully",
        transfer
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;