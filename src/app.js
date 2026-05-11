const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
    console.log(passwordHash);
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
      res.cookie("token", "hdhjKXKAHGXALXJAKHXJHAXUAU");
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
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  res.send("Reeading cookies");
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.mailID;

  try {
    const users = await User.find({ mailID: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Feed API - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Delete API - to delete an user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Update API - to update an user in the database
app.patch("/user:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["userId", "photoUrl", "skills", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong ");
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
