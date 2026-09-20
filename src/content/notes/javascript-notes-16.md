---
title: "Callback hell"
part: "JavaScript Notes"
track: "javascript"
kind: "notes"
updated: "2026-09-14"
source: "JavaScript Notes.docx"
draft: false
order: 11
description: "JavaScript — Callback hell."
---
**Callback hell** in JavaScript occurs when multiple callbacks are nested inside each other, which creates complex and hard-to-manage code.

![](/notes-img/javascript-notes/img-034.webp)

**Callback hell (callback pyramid)**, also known as the **"Pyramid of Doom"**, is when nested callbacks lead to deeply indented, hard-to-read code. The code grows sideways and looks like a pyramid.

### Example: an e-commerce order flow

Each step depends on the previous one, so each call is placed inside the previous callback:

```js
const cart = ["shoes", "pants", "kurta"];

api.createOrder(cart, function (orderId) {
  api.proceedToPayment(orderId, function (paymentInfo) {
    api.showOrderSummary(paymentInfo, function (summary) {
      api.updateWallet(summary, function () {
        console.log("Order complete");
      });
    });
  });
});
```

**Runnable version with setTimeout:**

```js
function step(name, callback) {
  setTimeout(() => {
    console.log(name + " done");
    callback();
  }, 500);
}

step("Create order", () => {
  step("Payment", () => {
    step("Order summary", () => {
      step("Update wallet", () => {
        console.log("All steps finished");
      });
    });
  });
});

// Create order done
// Payment done
// Order summary done
// Update wallet done
// All steps finished
```

**Problems with callback hell:**

1.  **Hard to read and maintain** — the logic grows to the right instead of top to bottom.
2.  **Error handling is repeated** — every level needs its own error check.
3.  **Inversion of control** — explained below.

```js
getUser(id, function (err, user) {
  if (err) return handleError(err);
  getOrders(user, function (err, orders) {
    if (err) return handleError(err);
    getInvoice(orders[0], function (err, invoice) {
      if (err) return handleError(err);
      console.log(invoice);
    });
  });
});
```

### Inversion of control

**Inversion of Control (IoC)** is a programming principle where the flow of control is managed by external code (a framework or library) instead of your own code.

In the order example, we give our callback to `api.createOrder` and **trust** it to call our function correctly. We lose control of our program and hand control of our callback over to another function. What if `createOrder`:

-   never calls the callback?
-   calls it **twice** (charging payment twice)?
-   calls it too early, or with wrong data?
-   throws an error that swallows our callback?

We can't control any of this, because the callback is running inside someone else's code.

### Solution: Promises and async/await

**Promises** fix both problems: the code becomes a flat chain, and **we** attach the handlers to a promise object, which guarantees it resolves only **once**.

```js
api.createOrder(cart)
  .then(orderId => api.proceedToPayment(orderId))
  .then(paymentInfo => api.showOrderSummary(paymentInfo))
  .then(summary => api.updateWallet(summary))
  .then(() => console.log("Order complete"))
  .catch(err => console.error("Something failed:", err)); // one place for errors
```

With **async/await** it reads like synchronous code:

```js
async function placeOrder(cart) {
  try {
    const orderId = await api.createOrder(cart);
    const paymentInfo = await api.proceedToPayment(orderId);
    const summary = await api.showOrderSummary(paymentInfo);
    await api.updateWallet(summary);
    console.log("Order complete");
  } catch (err) {
    console.error("Something failed:", err);
  }
}
```

The runnable `step` example converted to promises:

```js
const stepP = (name) =>
  new Promise(resolve => setTimeout(() => {
    console.log(name + " done");
    resolve();
  }, 500));

stepP("Create order")
  .then(() => stepP("Payment"))
  .then(() => stepP("Order summary"))
  .then(() => stepP("Update wallet"))
  .then(() => console.log("All steps finished"));
```

Other ways to reduce nesting even with callbacks: use **named functions** instead of anonymous ones, and keep functions small. See the **Promise** chapter next.
