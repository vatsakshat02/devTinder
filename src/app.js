const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("hello from the server");
});

app.use("/test", (req, res) => {
  res.send("hello from the test page");
});

app.use("/help", (req, res) => {
  res.send("hello from the customer servic");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
