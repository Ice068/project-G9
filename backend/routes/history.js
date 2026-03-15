const express = require("express");
const router = express.Router();

const { reservations } = require("../data");

router.get("/:userId", (req, res) => {

  const userId = req.params.userId;

  const history = reservations.filter(r => r.userId === userId);

  res.json(history);

});

module.exports = router;