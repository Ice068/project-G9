document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorBox = document.getElementById('error-message');

    errorBox.classList.add('d-none');

    try {
        // ==========================================
        // 📍 [รอ Backend] จุดที่ต้องเปลี่ยนไปใช้ fetch() เรียก API Login จริง
        // ==========================================
        
        // ชั่วคราว: กำหนดรหัสผ่านจำลองคือ admin / 1234
        if (user === "admin" && pass === "1234") {
            const fakeToken = "dummy-jwt-token-from-backend";
            localStorage.setItem('adminToken', fakeToken); // เก็บกุญแจ
            window.location.href = 'index.html'; // พาไปหน้า Dashboard
        } else {
            errorBox.classList.remove('d-none'); // รหัสผิด
        }

    } catch (error) {
        console.error("Login Error:", error);
    }
});