const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT } = require("./src/config/config");
const routerUser = require("./src/routes/user.routes");
const emailRoutes = require("./src/routes/email.routes");
const tokenRoutes = require("./src/routes/token.routes");
const foodRoutes = require("./src/routes/food.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const { fetchFoods } = require("./src/controller/foods.controller");
const { fetchFoodsApi } = require("./src/controller/foods.controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routerUser);
app.use("/api", emailRoutes);
app.use("/api", tokenRoutes);
app.use("/api", foodRoutes);
app.use("/api", paymentRoutes);
app.post("/api/stripe", async (req, res) => {
  const lineitems = [{ price: "price_1PBEmn08IBrpGdbY1oPoufnW", quantity: 1 }];
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineitems,
    mode: "subscription",
    success_url: `${process.env.CLIENT_URL}/user/home`,
    cancel_url: `${process.env.CLIENT_URL}/user/home`,
  });
  res.json({ id: session.id });
});
app.get("/", fetchFoodsApi);
fetchFoods();
app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));
