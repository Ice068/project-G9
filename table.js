let totalTables = 10
let reservedTables = 0

document.getElementById("tableCount").innerText = totalTables

/* จำกัดวันที่เลือก */

let today = new Date()
let maxDate = new Date()

maxDate.setFullYear(today.getFullYear() + 1)

let dateInput = document.getElementById("date")

dateInput.min = today.toISOString().split("T")[0]
dateInput.max = maxDate.toISOString().split("T")[0]

document.getElementById("reservationForm").addEventListener("submit", function(e){

e.preventDefault()

let fullname = document.getElementById("fullname").value.trim()
let email = document.getElementById("email").value.trim()
let phone = document.getElementById("phone").value.trim()
let date = document.getElementById("date").value
let time = document.getElementById("time").value
let guests = document.getElementById("guests").value

let selectedYear = new Date(date).getFullYear()
let currentYear = new Date().getFullYear()

/* ตรวจสอบข้อมูลว่าง */

if(!fullname || !email || !phone || !date || !time || !guests){
alert("Please fill in all fields")
return
}

/* ตรวจสอบ email format */

let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
if(!email.match(emailPattern)){
alert("Please enter a valid email address")
return
}

/* ป้องกันจองย้อนหลัง */

if(date < today.toISOString().split("T")[0]){
alert("Cannot reserve past dates")
return
}

/* ป้องกันปีเกิน */

if(selectedYear > currentYear + 1){
alert("Reservation year is too far in the future")
return
}

/* จำกัดเวลาเปิดร้าน */

if(time < "10:00" || time > "22:00"){
alert("Reservation time must be between 10:00 - 22:00")
return
}

/* จำกัดจำนวนคน */

if(guests > 10){
alert("Maximum 10 guests per table")
return
}

/* เช็คโต๊ะว่าง */

if(reservedTables >= totalTables){
alert("Sorry, all tables are fully booked")
return
}

/* ทำการจอง */

reservedTables++

document.getElementById("tableCount").innerText = totalTables - reservedTables

alert("Reservation Confirmed!")

})