require("dotenv").config();
const { readFileSync } = require("node:fs");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

// Keep product prices in the server-owned catalog so checkout requests cannot
// change the amount a customer is charged.
const productsData = JSON.parse(
  readFileSync(path.join(__dirname, "../public/data.json"), "utf8"),
);
const products = productsData.products;

// Build the API separately from starting the listener so tests can supply a
// fake Stripe client without needing real Stripe credentials.
function createApp({ stripe, connectedAccountId, frontendUrl }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.post("/api/create-checkout-session", async (req, res) => {
    // The browser sends only an ID; the server decides the price and recipient.
    const { productId } = req.body ?? {};

    if (typeof productId !== "string" || productId.trim() === "") {
      return res.status(400).json({ error: "A valid productId is required." });
    }

    // Resolve price and display name from the server catalog, not request data.
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const amount = Math.round(product.price * 100);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      console.error(`Invalid configured price for product "${product.id}".`);
      return res.status(500).json({ error: "Product price is not configured." });
    }

    try {
      // These paths return the customer to the frontend after Checkout.
      const successUrl = new URL("/payment/success", frontendUrl).toString();
      const cancelUrl = new URL("/payment/canceled", frontendUrl).toString();

      // Stripe hosts the payment form, then routes the payment to the
      // configured connected account through transfer_data.destination.
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: { name: product.name },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        // Destination charges route the payment to this server-configured
        // connected account after the customer completes Checkout.
        payment_intent_data: {
          transfer_data: { destination: connectedAccountId },
          metadata: { product_id: product.id },
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      if (!session.url) {
        throw new Error("Stripe did not return a Checkout URL.");
      }

      return res.status(201).json({ url: session.url });
    } catch (error) {
      console.error("Failed to create Stripe Checkout session:", error);
      return res.status(500).json({ error: "Could not create checkout session." });
    }
  });

  return app;
}

function startServer() {
  // Credentials and recipient configuration stay on the backend, never in the
  // browser bundle. Fail at startup if required settings are missing.
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const connectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!stripeSecretKey) {
    throw new Error("Set STRIPE_SECRET_KEY in backend/.env before starting the API.");
  }
  if (!connectedAccountId || !connectedAccountId.startsWith("acct_")) {
    throw new Error(
      "Set STRIPE_CONNECTED_ACCOUNT_ID to the recipient's connected acct_ ID.",
    );
  }

  const frontend = new URL(frontendUrl);
  if (frontend.protocol !== "http:" && frontend.protocol !== "https:") {
    throw new Error("FRONTEND_URL must use http or https.");
  }

  const stripe = Stripe(stripeSecretKey);
  const app = createApp({
    stripe,
    connectedAccountId,
    frontendUrl: frontend.origin,
  });
  const port = Number(process.env.PORT) || 3000;

  return app.listen(port, () => {
    console.log(`Stripe checkout API listening on port ${port}`);
  });
}

// Only start listening when executed directly; importing this file in tests
// exposes the app factory without opening a permanent server.
if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
