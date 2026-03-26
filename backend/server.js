const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ============================
// Mock Database (เก็บใน memory)
// ============================

// ============================
// Mock Database (เก็บใน memory)
// ============================
let reservations = [
    {
        id: 1,
        fullname: "สมชาย ใจดี",
        email: "somchai@gmail.com",
        date: "27/03/2026",
        time: "18:00",
        guests: 2,
        note: "ขอโต๊ะริมหน้าต่าง",
        status: "active"
    },
    {
        id: 2,
        fullname: "สมหญิง รักเรียน",
        email: "somying@gmail.com",
        date: "28/03/2026",
        time: "19:30",
        guests: 4,
        note: "แพ้อาหารทะเล",
        status: "active"
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

// ============================
// POST - เพิ่มการจอง
// ============================
app.post("/api/reservations", (req, res) => {
    const newReservation = req.body;

    // สร้าง ID ใหม่
    const newId = reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1;

    // จัดเรียงข้อมูลให้ตรงกับที่หน้า History ต้องการ
    const formattedData = {
        id: newId,
        fullname: newReservation.fullname || "(ไม่มีชื่อ)",
        email: newReservation.email || "-",
        date: newReservation.date || "-",
        time: newReservation.time || "-",
        guests: newReservation.guests || "-",
        note: newReservation.note || "", 
        status: "active"
    };

    // บันทึกลงตัวแปร reservations
    reservations.push(formattedData);

    res.json({ message: "จองโต๊ะสำเร็จเรียบร้อย!" });
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
// POST - ตรวจสอบ history
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