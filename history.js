document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("historyForm");
    const message = document.getElementById("formMessage");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const reserveNumber = document.getElementById("reserveNumber").value.trim();
        const otp = document.getElementById("otp").value.trim();

        // ตรวจสอบก่อนส่ง
        if (!reserveNumber || !otp) {
            message.innerText = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        message.innerText = "Processing...";
        message.style.color = "white";

        try {

            const response = await fetch("http://localhost:3000/api/history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reserveNumber, otp })
            });

            const data = await response.json();

            if (response.ok) {

                message.innerText = "Reservation verified successfully!";
                message.style.color = "#d4af37";

                // ถ้าจะ redirect ไปหน้ารายละเอียด
                // window.location.href = `reservation-details.html?id=${data._id}`;

            } else {

                message.innerText = data.message || "Invalid reserve number or OTP";
                message.style.color = "red";
            }

        } catch (error) {

            console.error(error);
            message.innerText = "Server error. Please try again.";
            message.style.color = "red";
        }

    });

});