const errorMessage = `Stripe payments is disabled. See src/util/stripe.js for more details.`;

export async function redirectToCheckout(planId) {
  throw new Error(errorMessage);
}

export async function redirectToBilling() {
  throw new Error(errorMessage);
}
