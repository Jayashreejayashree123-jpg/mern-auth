Js id="z3p54c"
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(5000, () => {
  console.log("Server started");
});
