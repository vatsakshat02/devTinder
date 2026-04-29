const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Akshat", lastName: "Vats" });
});

app.post("/user", (req, res) => {
  console.log("Data saved successfully to the database");
  res.send("data saved to the database");
});

app.use("/test", (req, res) => {
  res.send("hello from the test page");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
