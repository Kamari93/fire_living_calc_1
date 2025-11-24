const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  defaultInvestmentReturn: { type: Number, default: 0.07 },
});

const UserModel = mongoose.model("User", UserSchema, "User");

module.exports = UserModel;
// This model defines the structure of the User document in MongoDB.
// It includes fields for email, password, and createdAt timestamp.
