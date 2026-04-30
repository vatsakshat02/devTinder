const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  next();
});

app.use("/user", (req, res, next) => {
  // res.send("response 1");
  next();
});

app.use("/user", (req, res, next) => {
  res.send("response 2");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
