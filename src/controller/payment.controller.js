const { PRODUCT_ID, STRIPE_SECRET, CLIENT_URL } = require("../config/config");
const stripe = require("stripe")(STRIPE_SECRET);

const subscribeController = async (req, res) => {
  const lineitems = [{ price: PRODUCT_ID, quantity: 1 }];
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineitems,
    mode: "subscription",
    success_url: `${CLIENT_URL}/user/home`,
    cancel_url: `${CLIENT_URL}/user/home`,
  });
  res.json({ id: session.id });
};
module.exports = { subscribeController };
