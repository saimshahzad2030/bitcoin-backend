const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  PORT,
  FREE_TRIAL_ID,
  GOLD_ID,
  SILVER_ID,
  BRONZE_ID,
} = require("./src/config/config");
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
app.use(express.json());
app.use("/api", routerUser);
app.use("/api", coindataroutes);
app.use("/api", emailRoutes);
app.use("/api", tokenRoutes);
app.use("/api", foodRoutes);
app.use("/api", paymentRoutes);

app.get("/api/fetchSingleCoin", fetchSingleCoin);
app.get("/api/fetchAllCoins", fetchAllCoins);
app.get("/", fetchFoodsApi);

const matcher = {
  [FREE_TRIAL_ID]: ["Free Trial", 7],
  [GOLD_ID]: ["Gold", 30],
  [SILVER_ID]: ["Silver", 30],
  [BRONZE_ID]: ["Bronze", 30],
};
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
  }
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const planId = subscription.plan.id;
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = customer.email;
    await supabase
      .from("Users")
      .update({
        status: "approved",
        freeTrialSubscribed:
          planId === FREE_TRIAL_ID ||
          planId === BRONZE_ID ||
          planId === SILVER_ID ||
          planId === GOLD_ID,
      })
      .eq("email", customerEmail);
    await sendEmail(
      customerEmail,
      `${matcher[planId][0]} Subscription Added`,
      `Dear User you have subscribed ${matcher[planId][0]} plan Subscription, which will last till ${matcher[planId][1]} days`
    );
  }
  if (event.type === "subscription_schedule.expiring") {
    const customerEmail = event.data.object.customer_email;
    const today = new Date();
    const oneDayBeforeExpiry = new Date(event.data.object.expires_at);
    oneDayBeforeExpiry.setDate(oneDayBeforeExpiry.getDate() - 1);
    if (today >= oneDayBeforeExpiry) {
      await sendEmail(
        customerEmail,
        (subject = "Subscription ending Reminder"),
        (message = `your currently subscribed offer is expiring within 1 day. It's your last day to avail the offe so use our features to maximize your productivity and don't forget to resubscribe our offfer when it ends :)`)
      );
    }
  }
  res.json({ received: true });
});
fetchFoods();

app.listen(PORT, () => {
  console.log(`Server runing at PORT ${PORT}`);
});
