const { GOLD_ID, STRIPE_SECRET, CLIENT_URL } = require("../config/config");
const stripe = require("stripe")(STRIPE_SECRET);

const subscribeController = async (req, res) => {
  const { product_id } = req.query;
  console.log(product_id);
  const lineitems = [{ price: product_id, quantity: 1 }];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineitems,
    mode: "subscription",
    success_url: `${CLIENT_URL}/user/calculator`,
    cancel_url: `${CLIENT_URL}/user/home`,
    billing_address_collection: "auto",
    customer_email: req?.user?.user?.email ? req?.user?.user?.email : undefined,
  });
  //  // const subscriptions = await stripe.subscriptions.list({});
  // const customers = await stripe.customers.list({});
  // console.log("subscriptions", subscriptions.data[0]);

  // const cust = { name: "saim" };
  // const abc = { saim: "123" };
  // console.log(abc[cust.name]);

  res.json({ id: session.id });
};

const fetchRemainingTime = async (req, res) => {
  try {
    const customers = await stripe.customers.list({
      email: req?.user?.user?.email,
      // email: "saimshehzad2040@gmail.com",
    });
    const anySubscription = await hasSubscription(customers?.data[0]?.id);
    // console.log("anySubscription", anySubscription.exist);
    // console.log("Subscriptions", anySubscription.subscriptions);
    // console.log("subscribed product: ", anySubscription.product.name);

    if (
      anySubscription.exist &&
      customers &&
      customers.data &&
      customers.data.length > 0
    ) {
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: customers.data[0].id,
      });
      const date = new Date(upcomingInvoice.period_end * 1000);
      return res.status(200).json({
        date,
        message: `Dear ${req?.user?.user?.name}, you have subscribed ${anySubscription.product.name} plan `,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No Subsciption found from this customer" });
    }
  } catch (error) {
    return res.status(520).json({ message: error });
  }
};
async function hasSubscription(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
    });
    const product = await stripe.products.retrieve(
      subscriptions.data[0].items.data[0].price.product
    );

    return {
      exist: subscriptions.data.length > 0,
      subscriptions: subscriptions.data[0].items.data[0].price.product,
      product,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
}

module.exports = { subscribeController, fetchRemainingTime };
