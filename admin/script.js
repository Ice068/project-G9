// ==========================================
// 🛡️ 1. Security Check (ตรวจสอบการล็อกอิน)
// ==========================================
const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = 'login.html'; // ถ้าไม่มีกุญแจ เตะกลับหน้า Login
}

// ==========================================
// ⚙️ 2. UI & Event Listeners
// ==========================================
// Sidebar Toggle
const sidebarToggle = document.querySelector("#sidebar-toggle");
if(sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("collapsed");
    });
}

// Logout Button
const btnLogout = document.getElementById("btnLogout");
if(btnLogout) {
    btnLogout.addEventListener("click", function(e) {
        e.preventDefault();
        localStorage.removeItem('adminToken'); // ทำลายกุญแจ
        window.location.href = 'login.html'; // กลับหน้า Login
    });
}

// ==========================================
// 📡 3. Data Fetching (ดึงข้อมูลแบบ Real-time)
// ==========================================
// 📍 [รอ Backend] ใส่ URL ตรงนี้เมื่อ Backend พร้อม 
const API_URL = ""; 

let lineChartInstance = null;
let barChartInstance = null;

async function fetchRealData() {
    if (!API_URL) return; // ถ้ายังไม่ใส่ URL ให้หยุดรอเงียบๆ

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` } // ส่งกุญแจไปให้ Backend ตรวจด้วย
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // อัปเดตสถานะการเชื่อมต่อ
        const statusEl = document.getElementById('connection-status');
        statusEl.innerText = "Live";
        statusEl.classList.replace('bg-danger', 'bg-success');

        // สั่งวาดหน้าจอ
        updateDashboardUI(data);

    } catch (error) {
        console.error("Connection failed:", error);
        const statusEl = document.getElementById('connection-status');
        statusEl.innerText = "Disconnected";
        statusEl.classList.replace('bg-success', 'bg-danger');
    }
}

// ==========================================
// 🎨 4. Render Functions (วาดข้อมูลลงหน้าเว็บ)
// ==========================================
function updateDashboardUI(data) {
    document.getElementById('stat-users').innerText = data.stats.users.toLocaleString();
    document.getElementById('stat-revenue').innerText = '$' + data.stats.revenue.toLocaleString();
    document.getElementById('stat-orders').innerText = data.stats.orders.toLocaleString();
    document.getElementById('stat-visitors').innerText = data.stats.visitors.toLocaleString();

    const tableBody = document.getElementById('table-orders');
    tableBody.innerHTML = ''; 
    data.orders.forEach(order => {
        let badgeClass = order.status === 'Completed' ? 'bg-success' : 
                         order.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger';

        tableBody.innerHTML += `
            <tr>
                <th scope="row">${order.id}</th>
                <td>${order.name}</td>
                <td><span class="badge ${badgeClass}">${order.status}</span></td>
                <td>$${Number(order.amount).toFixed(2)}</td>
            </tr>
        `;
    });

    if (!lineChartInstance || !barChartInstance) {
        initCharts(data.charts);
    } else {
        updateCharts(data.charts);
    }
}

function initCharts(chartData) {
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        lineChartInstance = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{ label: 'Revenue ($)', data: chartData.revenue, backgroundColor: 'rgba(59, 125, 221, 0.2)', borderColor: 'rgba(59, 125, 221, 1)', borderWidth: 2, tension: 0.4, fill: true }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        barChartInstance = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{ label: 'Sales', data: chartData.sales, backgroundColor: 'rgba(54, 162, 235, 0.7)', borderWidth: 1 }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }
}

function updateCharts(chartData) {
    if(lineChartInstance) {
        lineChartInstance.data.labels = chartData.labels;
        lineChartInstance.data.datasets[0].data = chartData.revenue;
        lineChartInstance.update();
    }
    if(barChartInstance) {
        barChartInstance.data.labels = chartData.labels;
        barChartInstance.data.datasets[0].data = chartData.sales;
        barChartInstance.update();
    }
}

// ==========================================
// 🚀 5. Start Application
// ==========================================
fetchRealData(); // ดึงครั้งแรก
setInterval(fetchRealData, 5000); // ดึงซ้ำทุกๆ 5 วินาที