// ==========================
// 🚀 LOAD DATA
// ==========================
async function loadDashboard() {
  try {
    const res = await fetch("http://localhost:3000/data");

    if (!res.ok) throw new Error("โหลดไม่ได้");

    const data = await res.json();

    console.log("DATA:", data);

    // ==========================
    // 📊 STAT
    // ==========================
    document.getElementById("stat-users").innerText =
      new Set(data.map(r => r.email)).size;

    // ✅ ไม่นับ cancelled
    const activeOrders = data.filter(r => r.status !== "cancelled");

    document.getElementById("stat-orders").innerText = activeOrders.length;

    // ==========================
    // 🟢 CONNECTION
    // ==========================
    const status = document.getElementById("connection-status");
    status.innerText = "Connected";
    status.classList.remove("bg-danger");
    status.classList.add("bg-success");

    // ==========================
    // 📋 TABLE
    // ==========================
    const table = document.getElementById("table-orders");
    table.innerHTML = "";

    data.forEach(r => {
      table.innerHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${r.fullname}</td>
          <td>
            <span class="badge ${
              r.status === "cancelled"
                ? "bg-danger"
                : "bg-success"
            }">
              ${r.status}
            </span>
          </td>
          <td>${r.guests}</td>
        </tr>
      `;
    });

    // ==========================
    // 📈 CHART
    // ==========================
    renderCharts(activeOrders); // 🔥 ส่งเฉพาะ active

  } catch (err) {
    console.error(err);

    document.getElementById("connection-status").innerText = "Disconnected";
  }
}

// ==========================
// 📈 CHART
// ==========================
let lineChart, barChart;

function renderCharts(data) {
  const map = {};

  // ✅ data ที่เข้ามา = active แล้ว
  data.forEach(r => {
    map[r.date] = (map[r.date] || 0) + 1;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  // LINE
  const ctx1 = document.getElementById("lineChart");

  if (lineChart) lineChart.destroy();

  lineChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Reservations",
        data: values,
        borderWidth: 2,
        fill: true
      }]
    }
  });

  // BAR
  const ctx2 = document.getElementById("barChart");

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Bookings",
        data: values
      }]
    }
  });
}

// ==========================
// 🚀 START
// ==========================
loadDashboard();