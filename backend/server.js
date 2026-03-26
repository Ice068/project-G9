const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ==========================
// 🔐 LOGIN API
// ==========================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        return res.json({
            token: "my-secret-token"
        });
    }

    return res.status(401).json({ message: "Invalid login" });
});

// ==========================
// 📊 DASHBOARD API
// ==========================
app.get('/dashboard', (req, res) => {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ message: "No token" });
    }

    res.json({
        stats: {
            users: 120,
            revenue: 5400,
            orders: 320,
            visitors: 980
        },
        orders: [
            { id: 1, name: "Alice", status: "Completed", amount: 120 },
            { id: 2, name: "Bob", status: "Pending", amount: 80 },
            { id: 3, name: "John", status: "Cancelled", amount: 50 }
        ],
        charts: {
            labels: ["Jan", "Feb", "Mar", "Apr"],
            revenue: [1000, 2000, 1500, 2500],
            sales: [50, 70, 60, 90]
        }
    });
});

// ==========================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});