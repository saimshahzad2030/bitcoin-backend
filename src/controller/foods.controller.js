const supabase = require("../db/db");

const fetchFoods = async () => {
  try {
    const { data, error } = await supabase
      .from("Foods")
      .select("*")
      .filter("juice_name", "eq", "banana juice");

    if (error) {
      throw error;
    }

    console.log("Connected to Supabase successfully!");
    console.log("Data:", data);
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
  }
};
const fetchFoodsApi = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Foods").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).send("Error connecting to Supabase:", error.message);
  }
};
const addJuiceApi = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!price || !name) {
      return res.status(400).json({ message: "Please provide name and price" });
    }
    const { data: existingData, error: selectionError } = await supabase
      .from("IceCream")
      .select("*")
      .eq("name", name); // Check if a record with the same name already exists

    if (selectionError) {
      throw selectionError;
    }

    if (existingData.length > 0) {
      // If a record with the same name already exists, handle accordingly
      return res.status(400).json({ error: "Record already exists" });
    }
    await supabase.from("IceCream").insert([{ name, price }]);

    const { data, error: selectError } = await supabase
      .from("IceCream")
      .select("*")
      .eq("name", name);

    if (selectError) {
      throw selectError;
    }
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    res.status(520).send("Error connecting to Supabase:", error.message);
  }
};
module.exports = { fetchFoods, fetchFoodsApi, addJuiceApi };
