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
const e = require("express");

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
    // console.log("Checkout session completed:", event.data.object);
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
  if(event.type === 'customer.subscription.updated'){
    const subscription = event.data.object;
    console.log('subscription status after updating: ',subscription)

    // // Check if subscription status is "canceled"
    // if (subscription.status === 'canceled') {
    //   // Update user in your database
    //   console.log('Subscription has ended, updating user in database...');
    //   // Perform database update operations here
    // }
  } 
      
  if(event.type === "invoice.payment_succeeded"){
    const invoice = event.data.object; 
    const invoiceId = invoice.id;
    let product_Id;

    try {
      const lineItems = await stripe.invoices.listLineItems(invoiceId);
      lineItems.data.forEach(item => {
        const productId = item.price.id;  
        product_Id = item.price.id
      });
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: invoice.customer,
          status: 'active', 
        });
        await stripe.subscriptions.update(
          subscriptions.data[0]?.id,
          { cancel_at_period_end: product_Id===FREE_TRIAL_ID }
        );
        if (product_Id === FREE_TRIAL_ID) { 
          console.log('Subscription ended, updating user in database...');
        }
      } catch (error) {
        console.error("Error canceling subscriptions:", error);
      }
      
    } catch (error) {
      console.error('Error fetching invoice line items:', error);
    }

  }
  if(event.type ==="customer.subscription.deleted"){
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = customer.email; 
    await supabase
    .from("Users")
    .update({
      status: "pending"
    })
    .eq("email", customerEmail);
  }
  if(event.type === "invoice.payment_failed"){
    const invoice = event.data.object;
    const customerId = invoice.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = customer.email;
    await supabase
    .from("Users")
    .update({
      status: "pending"
    })
    .eq("email", customerEmail);
  }
  res.json({ received: true });
});
fetchFoods();
app.listen(PORT, async() => {
 
  console.log(`Server runing at PORT ${PORT}`);
});
