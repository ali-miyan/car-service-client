import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_TOKEN);

export default function App() {
  const options = {
    clientSecret: '{{CLIENT_SECRET}}',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {/* <CheckoutForm /> */}
    </Elements>
  );
};