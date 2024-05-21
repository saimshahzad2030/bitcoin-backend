const bcrypt = require("bcrypt");
const jwt = require("../middleware/jwt");
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
      .eq("email", email);

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
          email,
          name: existingData[0].name,
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
const forgetPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const hashPaswd = await bcrypt.hash(password, 10);
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ password: hashPaswd })
      .eq("email", email);

    if (updateError) {
      throw updateError;
    }

    const { data: existingData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    return res.status(200).json({
      newUser: existingData,
      role: "user",
      message: "Password Succesfully updated",
    });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).send("Error connecting to Supabase:", error.message);
  }
};
const updateNameController = async (req, res) => {
  try {
    const { email, name } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !name) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ name: name })
      .eq("email", email);

    if (updateError) {
      throw updateError;
    }

    const { data: existingData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    return res.status(200).json({
      newUser: existingData,
      role: "user",
      message: "Name Succesfully updated",
    });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).send("Error connecting to Supabase:", error.message);
  }
};
const updatePasswordController = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !newPassword) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const hashPaswd = await bcrypt.hash(newPassword, 10);
    const { data, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);
    const isPaswd = await bcrypt.compare(password, data[0].password);
    if (fetchError) {
      console.log("fetchError:", fetchError);
      throw fetchError;
    }
    if (!isPaswd) {
      return res.status(401).json({ message: "wrong credentials" });
    }

    const { data: updateUser, error: updateError } = await supabase
      .from("Users")
      .update({ password: hashPaswd })
      .eq("email", email);

    if (updateError) {
      console.log("updateError:", updateError);

      throw updateError;
    }
    const { data: existingData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    return res.status(200).json({
      newUser: existingData,
      role: "user",
      message: "Password Succesfully updated",
    });
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    res.status(520).send("Error connecting to Supabase:", error);
  }
};
const adminReset = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !name) {
      return res.status(404).json({ message: "all fields required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const hashPaswd = await bcrypt.hash(password, 10);

    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ name: name, password: hashPaswd }) // Replace "new_status" with the desired status value
      .eq("email", email);
    const { data: adminData, error: selectionError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email); // Check if a record with the same name already exists
    res
      .status(200)
      .json({ user: adminData, message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).json({
      message: "something went wrong",
    });
  }
};

module.exports = {
  login,
  signup,
  adminReset,
  forgetPasswordController,
  updatePasswordController,
  updateNameController,
};
