import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe only if public key is available
export const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;
