const User = require("../model/user.model");
const Token = require("../model/token.model");
const generateToken = require("../services/generate-token");
const sendEmail = require("../services/send-email");
const catchAsync = require("..//utils/catch-async");
const supabase = require("../db/db");
const verificationEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(401).json({ message: "Enter Email" });
      return;
    }
    const { data: emailalreadyExist, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (emailalreadyExist.length > 0) {
      return res.status(401).json({ message: "Email already exist" });
    }
    const verificationToken = generateToken();
    const { data, error: selectError } = await supabase
      .from("Tokens")
      .insert([{ email, token: verificationToken }]);

    if (selectError) {
      throw selectError;
    }

    await sendEmail(
      email,
      (subject = "Email Verification"),
      (message = `${verificationToken} is your verification Token`)
    );

    res.status(200).json({ email, message: `Email sent to ${email}` });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).json({
      message: error.message,
    });
  }
};

module.exports = verificationEmailController;
