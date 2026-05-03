const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vatsakshat02:vatsakshat02@cluster0.ni78wem.mongodb.net/devTinder"
  );
};

connectDB()
  .then(() => {
    console.log("Database has been connected successfully");
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
