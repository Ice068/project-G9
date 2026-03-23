console.log("JS ทำงาน");

window.onload = function () {

  const form = document.getElementById("reservationForm");

  if (!form) {
    console.error("❌ ไม่พบ form");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("กดแล้ว");

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;
    const note = document.getElementById("note").value;

    if (password !== confirmPassword) {
      alert("❌ Password ไม่ตรงกัน");
      return;
    }

    if (!fullname || !email || !password || !date || !time || !guests) {
      alert("❌ กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const data = {
      fullname,
      email,
      password,
      date,
      time,
      guests,
      note
    };

    console.log("📤 ส่งข้อมูล:", data);

    try {
      console.log("🚀 กำลังยิงไป server...");

      const res = await fetch("http://localhost:3000/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      console.log("📡 status:", res.status);

      const result = await res.json();
      console.log("🎉 result:", result);

      alert("✅ จองสำเร็จ!");

    } catch (error) {
      console.error("❌ ERROR:", error);
      alert("❌ เกิดข้อผิดพลาด");
    }

  });

};