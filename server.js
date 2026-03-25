const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// ==========================
// ✅ MIDDLEWARE
// ==========================
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// debug
app.use((req, res, next) => {
  console.log("🌍", req.method, req.url);
  console.log("📨 Body:", req.body);
  next();
});

// ==========================
// ✅ DATABASE
// ==========================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "eclipse_db"
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ Connected to MySQL");

    // users
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
      )
    `);

    // reservations (🔥 เพิ่ม status)
    db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date VARCHAR(50),
        time VARCHAR(50),
        guests INT,
        note TEXT,
        status VARCHAR(50) DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }
});

// ==========================
// ✅ ROUTES
// ==========================

// หน้าแรก
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ==========================
// ✅ GET DATA (🔥 เพิ่ม status)
// ==========================
app.get("/data", (req, res) => {
  db.query(`
    SELECT
      r.id,
      COALESCE(u.fullname, '(ไม่มีชื่อ)') AS fullname,
      COALESCE(u.email, '(ไม่มีอีเมล)') AS email,
      r.date,
      r.time,
      r.guests,
      r.note,
      r.status
    FROM reservations r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.id DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ==========================
// ✅ 🔥 RESERVE (กันซ้ำ)
// ==========================
app.post("/reserve", (req, res) => {
  const { fullname, email, password, date, time, guests, note } = req.body;

  if (!fullname || !email || !password || !date || !time) {
    return res.status(400).json({ message: "❌ ข้อมูลไม่ครบ" });
  }

  // เช็คจองซ้ำ
  const checkSql = `
    SELECT * FROM reservations
    WHERE date = ? AND time = ? AND status = 'active'
  `;

  db.query(checkSql, [date, time], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({
        message: "❌ เวลานี้ถูกจองไปแล้ว"
      });
    }

    // เพิ่ม user
    const userSql = `
      INSERT INTO users (fullname, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(userSql, [fullname, email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "เพิ่ม user ไม่สำเร็จ" });
      }

      const userId = result.insertId;

      // เพิ่ม reservation
      const reserveSql = `
        INSERT INTO reservations (user_id, date, time, guests, note)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        reserveSql,
        [userId, date, time, parseInt(guests), note],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "จองไม่สำเร็จ" });
          }

          res.json({ message: "✅ จองสำเร็จ!" });
        }
      );
    });
  });
});

// ==========================
// ✅ 🔥 CANCEL (ยกเลิก)
// ==========================
app.post("/cancel/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE reservations SET status = 'cancelled' WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "❌ ยกเลิกไม่สำเร็จ" });
      }

      res.json({ message: "✅ ยกเลิกการจองแล้ว" });
    }
  );
});

// ==========================
// ✅ START SERVER
// ==========================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});