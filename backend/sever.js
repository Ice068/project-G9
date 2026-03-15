const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/otp", require("./routes/otp"));
app.use("/api/reservation", require("./routes/reservation"));
app.use("/api/history", require("./routes/history"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});