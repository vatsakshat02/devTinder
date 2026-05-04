const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  const user = new User({
    firstName: "Akshat",
    lastName: "vats",
    mailID: "abc@gmail.com",
    password: "Akshat@123",
  });
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database has been connected successfully");

    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
