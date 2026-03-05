// ============================
// Mock Data (ใช้ถ้า Backend ยังไม่เปิด)
// ============================

let reservations = [
{
    id:1,
    name:"Table for 2",
    price:1200
},
{
    id:2,
    name:"Table for 4",
    price:2000
}
];


// ============================
// โหลดข้อมูลจาก Backend
// ============================

async function fetchReservations(){

    try{

        const res = await fetch("http://localhost:3000/api/reservations");

        if(!res.ok){
            throw new Error("Server not ready");
        }

        const data = await res.json();

        if(data.length > 0){
            reservations = data;
        }

    }catch(err){

        console.log("Using mock data (backend not running)");

    }

    loadHistory();
}



// ============================
// แสดงรายการจอง
// ============================

function loadHistory(){

    const container = document.getElementById("historyItems");

    if(!container) return;

    container.innerHTML = "";

    let total = 0;

    reservations.forEach(item => {

        const price = Number(item.price);
        total += price;

        const div = document.createElement("div");
        div.className = "history-item";

        div.innerHTML = `

        <div class="item-info">

            <p><strong>${item.name}</strong></p>
            <p>${price} B</p>

        </div>

        <div class="button-group">

            <button class="btn btn-warning btn-sm"
            onclick="editReservation(${item.id})">
            Edit
            </button>

            <button class="btn btn-danger btn-sm"
            onclick="cancelReservation(${item.id})">
            Cancel
            </button>

        </div>

        `;

        container.appendChild(div);

    });

    updateTotal(total);
}



// ============================
// คำนวณราคา
// ============================

function updateTotal(total){

    const vat = total * 0.07;
    const grand = total + vat;

    document.getElementById("totalAmount").innerText =
    total + " B";

    document.getElementById("vatAmount").innerText =
    vat.toFixed(2) + " B";

    document.getElementById("grandTotal").innerText =
    grand.toFixed(2) + " B";

}



// ============================
// แก้ไขการจอง
// ============================

function editReservation(id){

    const reservation =
    reservations.find(r => r.id === id);

    if(!reservation) return;

    let newName =
    prompt("Edit table name:", reservation.name);

    if(newName === null) return;

    newName = newName.trim();

    if(newName === ""){
        alert("Name cannot be empty");
        return;
    }

    reservation.name = newName;

    loadHistory();
}



// ============================
// ยกเลิกการจอง
// ============================

async function cancelReservation(id){

    const confirmCancel =
    confirm("Cancel reservation?");

    if(!confirmCancel) return;


    // ถ้ามี Backend จะพยายามลบจาก API
    try{

        await fetch(
        "http://localhost:3000/api/reservations/" + id,
        {
            method:"DELETE"
        });

    }catch(err){

        console.log("Backend not running");

    }


    // ลบจาก frontend
    reservations =
    reservations.filter(r => r.id !== id);

    loadHistory();
}



// ============================
// เพิ่มการจอง (เตรียมใช้ Backend)
// ============================

async function addReservation(name,price){

    const newReservation = {

        id: Date.now(),
        name: name,
        price: price

    };

    try{

        await fetch(
        "http://localhost:3000/api/reservations",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newReservation)
        });

    }catch(err){

        console.log("Backend not ready");

    }

    reservations.push(newReservation);

    loadHistory();
}



// ============================
// โหลดตอนเปิดหน้า
// ============================

window.onload = function(){

    fetchReservations();

}