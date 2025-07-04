const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Taxpayer", "Organization", "Admin"], // Enum to restrict roles to 'taxpayer' and 'organization'
    default: "Taxpayer",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
