// const mongoose = require("mongoose");
// const { MONGO_DB_URL } = require("../config/config");
// async function connectDb() {
//   try {
//     await mongoose.connect(MONGO_DB_URL);
//     console.log("Database connected successfully!");
//   } catch (error) {
//     console.log(error);
//   }
// }

const { createClient } = require("@supabase/supabase-js");
const { SUPA_DB_API_KEY, SUPA_DB_URL } = require("../config/config");
const supabase = createClient(SUPA_DB_URL, SUPA_DB_API_KEY);
module.exports = supabase;
