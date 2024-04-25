const mongoose = require("mongoose");
const TokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: Number, required: true },
});

module.exports = mongoose.model("Tokens", TokenSchema);
