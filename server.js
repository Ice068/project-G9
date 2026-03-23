const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Serve static files จาก current directory
app.use(express.static(path.join(__dirname)));

// debug ทุก request
app.use((req, res, next) => {
  console.log("🌍 มี request เข้า:", req.method, req.url, new Date().toLocaleTimeString());
  if (req.body) {
    console.log("📨 Body:", req.body);
  }
  next();
});

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// สร้าง connection สำหรับ MySQL (ไม่ใช้ pool)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "eclipse_db"
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
    setTimeout(() => {
      console.log("🔄 Retrying connection...");
      db.connect();
    }, 3000);
  } else {
    console.log("✅ Connected to MySQL");
    
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
      )
    `, (err) => {
      if (err) console.log("❌ Create users table error:", err.message);
    });
    
    db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date VARCHAR(255),
        time VARCHAR(255),
        guests INT,
        note TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.log("❌ Create reservations table error:", err.message);
    });
  }
});

// test route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});

// API ดูข้อมูลทั้งหมด
app.get("/data", (req, res) => {
  db.query(`
    SELECT
      r.*,
      COALESCE(u.fullname, '(ไม่มีชื่อ)') AS fullname,
      COALESCE(u.email, '(ไม่มีอีเมล)') AS email
    FROM reservations r
    LEFT JOIN users u ON r.user_id = u.id
  `, (err, rows) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json(rows);
  });
});

// API จองโต๊ะ
app.post("/reserve", (req, res) => {
  console.log("\n");
  console.log("========================================");
  console.log("🔥🔥🔥 POST /reserve ได้รับ request แล้ว 🔥🔥🔥");
  console.log("========================================");
  console.log("req.body:", JSON.stringify(req.body, null, 2));

  const { fullname, email, password, date, time, guests, note } = req.body;

  if (!fullname || !email || !password) {
    console.log("❌ ข้อมูลไม่ครบ");
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  console.log("✅ ข้อมูลครบ - เริ่มเพิ่มข้อมูล");
  console.log("📝 fullname:", fullname);
  console.log("📝 email:", email);
  console.log("📝 date:", date);
  console.log("📝 time:", time);
  console.log("📝 guests:", guests);

  // เพิ่ม user ก่อน
  const userSql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
  console.log("💾 ยิง SQL user:", userSql);
  
  db.query(userSql, [fullname, email, password], function(err, result) {
    if (err) {
      console.log("❌❌❌ ERROR ตอนเพิ่ม user:", err.message);
      console.log("❌ Error code:", err.code);
      console.log("❌ SQL:", err.sql);
      return res.status(500).json({ message: "เพิ่ม user ไม่สำเร็จ", error: err.message });
    }

    const userId = result.insertId;
    console.log("✅ User เพิ่มสำเร็จ! userId =", userId);

    // เพิ่ม reservation
    const reserveSql = "INSERT INTO reservations (user_id, date, time, guests, note) VALUES (?, ?, ?, ?, ?)";
    console.log("💾 ยิง SQL reservation:", reserveSql);
    
    db.query(reserveSql, [userId, date, time, parseInt(guests), note], function(err) {
      if (err) {
        console.log("❌❌❌ ERROR ตอนเพิ่ม reservation:", err.message);
        console.log("❌ Error code:", err.code);
        console.log("❌ SQL:", err.sql);
        return res.status(500).json({ message: "จองโต๊ะไม่สำเร็จ", error: err.message });
      }

      console.log("✅✅✅ Reservation เพิ่มสำเร็จ!");
      console.log("========================================\n");
      res.status(200).json({ message: "Reservation success! 🎉" });
    });
  });
});

// run server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});