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
  res.json({ id: session.id });
};

const fetchRemainingTime = async (req, res) => {
  try {
    console.log(req?.user?.user?.email)
    const customers = await stripe.customers.list({
      email: req?.user?.user?.email,
    });
    console.log('customer Id: ',customers?.data[0]?.id)
    const anySubscription = await hasSubscription(customers?.data[0]?.id);

    if (
      anySubscription.exist &&
      customers &&
      customers.data &&
      customers.data.length > 0
    ) {
      console.log('if condition true')
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: customers.data[0].id,
      });
      const date = new Date(upcomingInvoice.period_end * 1000);
      return res.status(200).json({
        date,
        subscription: anySubscription.product.name,
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
    if(subscriptions.data.length === 0){
      return {
        exist: false,
        subscriptions: null,
        product: null,
      };
    }
     
    const product = await stripe.products.retrieve(
      subscriptions?.data[0]?.items?.data[0]?.price?.product
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
