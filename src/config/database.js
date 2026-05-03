const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vatsakshat02:vatsakshat02@cluster0.ni78wem.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
