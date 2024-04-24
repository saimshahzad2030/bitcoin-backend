const Token = require("../model/token.model");

const catchAsync = require("..//utils/catch-async");

const matchToken = catchAsync(async (req, res) => {
  const { email, token } = req.body;

  if (!email) {
    res.status(401).json({ message: "Enter Email" });
    return;
  } else if (!token) {
    res.status(401).json({ message: "Enter Token" });
    return;
  }
  const matchToken = await Token.findOne({ email, token });
  if (!matchToken) {
    res.status(401).json({ message: "Token Doesnt match" });
  } else {
    await Token.deleteOne({ email, token });
    res.status(200).json({ message: "Email Verified" });
  }
});

module.exports = { matchToken };
