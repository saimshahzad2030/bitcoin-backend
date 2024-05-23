const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { PORT } = require("./src/config/config");
const routerUser = require("./src/routes/user.routes");
const emailRoutes = require("./src/routes/email.routes");
const tokenRoutes = require("./src/routes/token.routes");
const foodRoutes = require("./src/routes/food.routes");
const coindataroutes = require(`./src/routes/coindata.routes`);
const { fetchFoods } = require("./src/controller/foods.controller");
const paymentRoutes = require("./src/routes/payment.routes");
const { STRIPE_SECRET, WEBHOOK_KEY } = require("./src/config/config");
const bodyParser = require("body-parser");
const stripe = require("stripe")(STRIPE_SECRET);
const supabase = require("./src/db/db");
const { fetchFoodsApi } = require("./src/controller/foods.controller");
const {
  fetchSingleCoin,
  fetchAllCoins,
} = require("./src/controller/Cryptop-Api.controller");
const sendEmail = require("./src/services/send-email");

const app = express();
app.use(cors());

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.get("/api/fetchSingleCoin", fetchSingleCoin);
app.get("/api/fetchAllCoins", fetchAllCoins);
app.use(express.json());

app.use("/api", routerUser);
app.use("/api", coindataroutes);
app.use("/api", emailRoutes);
app.use("/api", tokenRoutes);
app.use("/api", foodRoutes);
app.use("/api", paymentRoutes);

app.get("/", fetchFoodsApi);
app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, WEBHOOK_KEY);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed:", event.data.object);
    const customerEmail = event.data.object.customer_email;
    // const lineItems = event.data.object.display_items;

    // const productId = lineItems[0].price.product;

    // const product = await stripe.products.retrieve(productId);
    // console.log("Product Name:", product.name);
    // const { data, error } = await supabase
    //   .from("Foods")
    //   .update({ juice_name: product.name })
    //   .eq(juice_name, "banana juice");
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ status: "approved" })
      .eq("email", customerEmail);
  }
  if (event.type === "subscription_schedule.expiring") {
    const customerEmail = event.data.object.customer_email;
    await sendEmail(
      customerEmail,
      (subject = "Subscription ending Reminder"),
      (message = `your currently subscribed offer is expiring within 7 days use our features to maximize your productivity and don't forget to resubscribe our offfer when it ends :)`)
    );
  }
  res.json({ received: true });
});
fetchFoods();
app.listen(PORT, () => {
  console.log(`Server runing at PORT ${PORT}`);
});
