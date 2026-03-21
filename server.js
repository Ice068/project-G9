const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ============================
// Mock Database (เก็บใน memory)
// ============================

let reservations = [
    {
        id: 1,
        name: "Table for 2",
        price: 1200
    },
    {
        id: 2,
        name: "Table for 4",
        price: 2000
    }
];

// ============================
// GET - ดูรายการทั้งหมด
// ============================

app.get("/api/reservations", (req, res) => {
    res.json(reservations);
});

// ============================
// POST - เพิ่มการจอง
// ============================

app.post("/api/reservations", (req, res) => {

    const newReservation = req.body;

    if (!newReservation.name || !newReservation.price) {
        return res.status(400).json({ message: "Invalid data" });
    }

    reservations.push(newReservation);

    res.json({ message: "Reservation added" });
});

// ============================
// DELETE - ลบการจอง
// ============================

app.delete("/api/reservations/:id", (req, res) => {

    const id = parseInt(req.params.id);

    reservations = reservations.filter(r => r.id !== id);

    res.json({ message: "Deleted successfully" });
});

// ============================
// POST - ตรวจสอบ history (history_con.js)
// ============================

app.post("/api/history", (req, res) => {

    const { reserveNumber, email, phone, otp } = req.body;

    // mock check
    if (reserveNumber && email && phone && otp === "1234") {
        return res.json({
            message: "Verified",
            _id: reserveNumber
        });
    }

    res.status(400).json({
        message: "Invalid information"
    });
});

// ============================
// START SERVER
// ============================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});