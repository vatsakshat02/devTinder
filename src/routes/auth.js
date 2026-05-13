const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { mailID, password } = req.body;

    const user = await User.findOne({ mailID: mailID });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordvalid = await user.validatePassword(password);

    if (isPasswordvalid) {
      //generate a JWT token
      const token = await user.getJWT();
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

module.exports = authRouter;
