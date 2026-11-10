const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createApp } = require("./server");

let server;
let baseUrl;
let checkoutOptions;
let checkoutCallCount = 0;

// Start a real Express app on a temporary port, but replace Stripe with a
// predictable fake so tests never charge a card or need API credentials.
before(async () => {
  const stripe = {
    checkout: {
      sessions: {
        create: async (options) => {
          checkoutCallCount += 1;
          checkoutOptions = options;
          return { url: "https://checkout.stripe.test/session" };
        },
      },
    },
  };
  const app = createApp({
    stripe,
    connectedAccountId: "acct_test123",
    frontendUrl: "http://localhost:5173",
  });

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

// Close the temporary HTTP listener so the test process exits cleanly.
after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

// Verify that the server uses its catalog price and configured recipient,
// ignoring client-supplied amount/account values, and sets the return pages.
test("creates a Checkout session with catalog price and configured destination", async () => {
  const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Forged client price/account values must not control the payment.
    body: JSON.stringify({
      productId: "cota-jantar-a-velas",
      amount: 1,
      accountId: "acct_attacker",
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(checkoutCallCount, 1);
  assert.deepEqual(await response.json(), {
    url: "https://checkout.stripe.test/session",
  });
  assert.equal(
    checkoutOptions.line_items[0].price_data.unit_amount,
    5000,
  );
  assert.equal(
    checkoutOptions.payment_intent_data.transfer_data.destination,
    "acct_test123",
  );
  assert.equal(
    checkoutOptions.payment_intent_data.metadata.product_id,
    "cota-jantar-a-velas",
  );
  assert.equal(checkoutOptions.success_url, "http://localhost:5173/payment/success");
  assert.equal(checkoutOptions.cancel_url, "http://localhost:5173/payment/canceled");
});

// Invalid requests should return helpful status codes and must not reach Stripe.
test("rejects a missing or unknown product without calling Stripe", async () => {
  const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 5000 }),
  });

  assert.equal(response.status, 400);

  const unknownProductResponse = await fetch(
    `${baseUrl}/api/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "not-a-product" }),
    },
  );

  assert.equal(unknownProductResponse.status, 404);
  assert.equal(checkoutCallCount, 1);
});
