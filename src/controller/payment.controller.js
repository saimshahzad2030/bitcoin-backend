const { PRODUCT_ID, STRIPE_SECRET, CLIENT_URL } = require("../config/config");
const stripe = require("stripe")(STRIPE_SECRET);

const subscribeController = async (req, res) => {
  console.log(req?.user?.user?.email);
  const lineitems = [{ price: PRODUCT_ID, quantity: 1 }];
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineitems,
    mode: "subscription",
    success_url: `${CLIENT_URL}/user/home`,
    cancel_url: `${CLIENT_URL}/user/home`,
    billing_address_collection: "auto",
    customer_email: req?.user?.user?.email ? req?.user?.user?.email : undefined,
  });
  res.json({ id: session.id });
};
module.exports = { subscribeController };
