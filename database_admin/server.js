const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// serve ไฟล์ HTML
app.use(express.static(__dirname));

// เชื่อม SQLite database
const db = new sqlite3.Database('./admin.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// สร้างตาราง
function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    status TEXT DEFAULT 'Pending',
    amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS queues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  time TEXT,
  people INTEGER,
  note TEXT,
  status TEXT DEFAULT 'waiting'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Insert admin user
  db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', '1234', 'admin')`);

  // Insert sample orders
  db.run(`INSERT OR IGNORE INTO orders (name, status, amount) VALUES 
    ('Order #1', 'Completed', 1500),
    ('Order #2', 'Pending', 2500),
    ('Order #3', 'Completed', 3200)`);

  // Insert sample visitors
  db.run(`INSERT OR IGNORE INTO visitors (ip_address) VALUES 
    ('192.168.1.100'),
    ('192.168.1.101')`);
}

// API Routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(`${row.id}:${Date.now()}`).toString('base64');
    res.json({
      token,
      user: {
        id: row.id,
        username: row.username,
        role: row.role
      }
    });
  });
});

app.get('/dashboard', (req, res) => {
  // Get stats
  db.get(`SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT SUM(amount) FROM orders) as revenue,
    (SELECT COUNT(*) FROM orders) as orders,
    (SELECT COUNT(*) FROM visitors) as visitors`, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get orders
    db.all('SELECT id, name, status, amount FROM orders ORDER BY id DESC LIMIT 10', (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get chart data (last 7 days)
      db.all(`SELECT DATE(created_at) as date, SUM(amount) as revenue, COUNT(*) as sales 
               FROM orders 
               WHERE created_at >= datetime('now', '-7 days')
               GROUP BY DATE(created_at)
               ORDER BY date ASC`, (err, charts) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const chartLabels = charts.map(c => c.date);
        const chartRevenue = charts.map(c => c.revenue);
        const chartSales = charts.map(c => c.sales);

        res.json({
          stats,
          orders: orders.map(o => ({
            id: o.id,
            name: o.name,
            status: o.status,
            amount: o.amount
          })),
          charts: {
            labels: chartLabels,
            revenue: chartRevenue,
            sales: chartSales
          }
        });
      });
    });
  });
});

// test route
app.get('/test', (req, res) => {
  res.send('OK');
});

app.get('/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/queue', (req, res) => {
  db.all('SELECT * FROM queue', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});