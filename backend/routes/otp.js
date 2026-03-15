const express = require("express");
const router = express.Router();

const { otps } = require("../data");

router.post("/send", (req, res) => {

  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otps.push({
    email,
    otp
  });

  res.json({
    message: "OTP sent",
    otp
  });

});

module.exports = router;