const bcrypt = require("bcrypt");

const User = require("../model/user.model");
const jwt = require("../middleware/jwt");
const BlockedUser = require("../model/blocked-user.model");
const catchAsync = require("..//utils/catch-async");
const supabase = require("../db/db");
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !name) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const { data: existingData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email); // Check if a record with the same name already exists

    if (selectionError) {
      throw selectionError;
    }

    if (existingData.length > 0) {
      return res.status(409).json({ message: "email already exist" });
    }
    const hashPaswd = await bcrypt.hash(password, 10);
    await supabase
      .from("Users")
      .insert([{ email, password: hashPaswd, name, role: "user" }]);

    const { data, error: selectError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (selectError) {
      throw selectError;
    }
    const token = jwt.sign({ newUser: data });
    return res.status(200).json({
      message: "Signup Successful",
      token,
      role: "user",
      newUser: data,
    });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).send("Error connecting to Supabase:", error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const { data: existingData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (selectionError) {
      throw selectionError;
    }
    console.log("existing data", existingData[0]);
    if (existingData.length > 0) {
      const isPaswd = await bcrypt.compare(password, existingData[0].password);
      if (!isPaswd) {
        return res.status(401).json({ message: "wrong credentials" });
      }
      if (existingData[0].role === "admin") {
        const token = jwt.sign({ user: existingData[0] });

        res.status(200).json({
          message: "login successful",
          token,
          role: existingData[0].role,
        });
      } else {
        const token = jwt.sign({ user: existingData[0] });
        res.status(200).json({
          message: "login successful",
          name: existingData[0].name,
          token,
          role: existingData[0].role,
          status: existingData[0].status,
        });
      }
    } else {
      return res.status(401).json({ message: "wrong credentials" });
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).json({
      message: "something went wrong",
    });
  }
};

module.exports = { login, signup };
