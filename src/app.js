const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

//signup Api
app.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignupData(req);

    const { firstName, lastName, mailID, password } = req.body;
    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      mailID,
      password: passwordHash,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//Login Api
app.post("/login", async (req, res) => {
  try {
    const { mailID, password } = req.body;

    const user = await User.findOne({ mailID: mailID });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordvalid = bcrypt.compare(password, user.password);

    if (isPasswordvalid) {
      //generate a JWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "7d",
      });
      res.cookie("token", token);

      //Add the token to cookie and send the response to the user

      res.send("login successfull");
    } else {
      res.send("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//Profile Api
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("sending a connection request");

  res.send("Connection Request Sent");
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
