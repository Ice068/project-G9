async function loadHistory(){

    try{
        const response = await fetch("http://localhost:3000/api/reservations");
        const data = await response.json();

        const container = document.getElementById("historyItems");

        let total = 0;
        container.innerHTML = "";

        data.forEach(item => {

            const price = Number(item.price || 0);
            total += price;

            const div = document.createElement("div");
            div.classList.add("item");
            div.innerHTML = `
                <span>${item.name}</span>
                <span>${price} B</span>
            `;
            container.appendChild(div);
        });

        let vat = total * 0.07;
        let grandTotal = total + vat;

        document.getElementById("totalAmount").innerText = total.toFixed(2) + " B";
        document.getElementById("vatAmount").innerText = vat.toFixed(2) + " B";
        document.getElementById("grandTotal").innerText = grandTotal.toFixed(2) + " B";

    }catch(error){
        console.log("Backend not connected yet");
    }
}

loadHistory();