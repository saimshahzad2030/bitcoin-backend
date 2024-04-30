// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { PORT } = require("./src/config/config");
// const routerUser = require("./src/routes/user.routes");
// const emailRoutes = require("./src/routes/email.routes");
// const tokenRoutes = require("./src/routes/token.routes");
// const foodRoutes = require("./src/routes/food.routes");
// const paymentRoutes = require("./src/routes/payment.routes");
// const { fetchFoods } = require("./src/controller/foods.controller");
// const { fetchFoodsApi } = require("./src/controller/foods.controller");
// const stripe = require("stripe")(process.env.STRIPE_SECRET);
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", routerUser);
// app.use("/api", emailRoutes);
// app.use("/api", tokenRoutes);
// app.use("/api", foodRoutes);
// app.use("/api", paymentRoutes);
// app.post("/api/stripe", async (req, res) => {
//   const lineitems = [{ price: "price_1PBEmn08IBrpGdbY1oPoufnW", quantity: 1 }];
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineitems,
//     mode: "subscription",
//     success_url: `${process.env.CLIENT_URL}/user/home`,
//     cancel_url: `${process.env.CLIENT_URL}/user/home`,
//   });
//   res.json({ id: session.id });
// });
// app.get("/", fetchFoodsApi);
// fetchFoods();
// app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT } = require("./src/config/config");
const routerUser = require("./src/routes/user.routes");
const emailRoutes = require("./src/routes/email.routes");
const tokenRoutes = require("./src/routes/token.routes");
const foodRoutes = require("./src/routes/food.routes");
const { fetchFoods } = require("./src/controller/foods.controller");
const paymentRoutes = require("./src/routes/payment.routes");
const { STRIPE_SECRET } = require("./src/config/config");
const bodyParser = require("body-parser");
const stripe = require("stripe")(STRIPE_SECRET);
const supabase = require("./src/db/db");
const { fetchFoodsApi } = require("./src/controller/foods.controller");
// const { createTableIfNotExists } = require("./src/model/icecream.model");
// createTableIfNotExists();

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.use("/api", routerUser);
app.use("/api", emailRoutes);
app.use("/api", tokenRoutes);
app.use("/api", foodRoutes);
app.use("/api", paymentRoutes);

app.get("/", fetchFoodsApi);
app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_SECRET
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed:", event.data.object);
    const customerEmail = event.data.object.customer_email;
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ status: "approved" }) // Replace "new_status" with the desired status value
      .eq("email", customerEmail); // Condition to identify the user to update

    if (updateError) {
      throw updateError;
    }
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription.status === "active") {
      console.log("Subscription is active:", subscription);
    } else {
      console.log("Subscription is not active:", subscription);
    }
  }

  res.json({ received: true });
});
fetchFoods();
app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));
