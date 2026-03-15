const express = require("express");
const router = express.Router();

const { reservations } = require("../data");

router.post("/reserve", (req, res) => {

  const { userId, tableNumber, date, time } = req.body;

  const newReservation = {
    id: reservations.length + 1,
    userId,
    tableNumber,
    date,
    time,
    status: "pending"
  };

  reservations.push(newReservation);

  res.json({
    message: "Reservation created",
    data: newReservation
  });

});

module.exports = router;