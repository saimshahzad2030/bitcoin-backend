const Token = require("../model/token.model");

const catchAsync = require("..//utils/catch-async");
const supabase = require("../db/db");
const matchToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      res.status(401).json({ message: "Enter Email" });
      return;
    } else if (!token) {
      res.status(401).json({ message: "Enter Token" });
      return;
    }
    const { data: matchToken, error: selectionError } = await supabase
      .from("Tokens")
      .select("*")
      .eq("token", token);

    if (matchToken.length == 0) {
      return res.status(401).json({ message: "Token Doesnt match" });
    }
    await supabase.from("Tokens").delete().eq("token", token); // Assuming there's an "id" field in your Tokens table

    res.status(200).json({ message: "Email Verified" });
    //   res.status(200).json({ message: "Email Verified" });
    // const verificationToken = generateToken();
    // const { data, error: selectError } = await supabase
    //   .from("Tokens")
    //   .insert([{ email, token: verificationToken }]);

    // if (selectError) {
    //   throw selectError;
    // }

    // await sendEmail(
    //   email,
    //   (subject = "Email Verification"),
    //   (message = `${verificationToken} is your verification Token`)
    // );

    // res.status(200).json({ email, message: `Email sent to ${email}` });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).json({
      message: error.message,
    });
  }
};

module.exports = { matchToken };
