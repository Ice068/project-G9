document.getElementById("historyForm").addEventListener("submit", async function(e) {

    e.preventDefault(); // ไม่ให้รีโหลดหน้า

    const reserveNumber = document.getElementById("reserveNumber").value;
    const otp = document.getElementById("otp").value;
    const message = document.getElementById("formMessage");

    message.innerText = "Processing...";
    message.style.color = "white";

    try {

        const response = await fetch("http://localhost:3000/api/history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reserveNumber: reserveNumber,
                otp: otp
            })
        });

        const data = await response.json();

        if(response.ok){
            message.innerText = "Reservation verified successfully!";
            message.style.color = "#d4af37";

            // ตัวอย่าง: redirect
            // window.location.href = "reservation-details.html";

        } else {
            message.innerText = data.message || "Invalid reserve number or OTP";
            message.style.color = "red";
        }

    } catch (error) {
        message.innerText = "Server error. Please try again.";
        message.style.color = "red";
    }

});