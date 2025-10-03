// Service to create a Stripe Checkout Session
// Expects a backend endpoint at /api/create-checkout-session that returns { id: string } for the session
// or for embedded / elements mode could return { clientSecret: string } if using custom flow.
// Adjust the URL if your backend runs elsewhere; consider using a Vite proxy.

export interface CreateCheckoutSessionParams {
  amountCents: number;
  currency: string;
  donationType: 'one-time' | 'recurring';
  projectId: string;
  donor: {
    firstName: string;
    lastName: string;
    email: string;
    anonymous?: boolean;
  };
}

export interface CheckoutSessionResponse {
  id: string; // Checkout Session ID
  url?: string; // Optional direct url if backend creates and returns it
  clientSecret?: string; // For embedded components or elements payment intents (not used in redirect flow)
  error?: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      return { id: '', error: `HTTP ${res.status}` };
    }
    return res.json();
  } catch (e: any) {
    return { id: '', error: e.message };
  }
}
