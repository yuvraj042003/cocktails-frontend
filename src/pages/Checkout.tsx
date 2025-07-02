import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStripe } from '@/contexts/StripeContext';

// Make sure to replace this with your actual publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51OvPQCSJxmPB5Hs0Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5Hs5';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const { clientSecret, createPaymentIntent } = useStripe();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        setIsInitializing(true);
        await createPaymentIntent(totalPrice + 50); // Including delivery fee
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        toast({
          title: 'Payment Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive',
        });
        navigate('/cart');
      } finally {
        setIsInitializing(false);
      }
    };

    initializePayment();
  }, [user, items, navigate, createPaymentIntent, totalPrice, toast]);

  if (items.length === 0 || isInitializing) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Preparing checkout...</p>
      </div>
    );
  }

  const finalAmount = totalPrice + 50; // Including delivery fee

  return (
    <div className="container max-w-2xl py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-card rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground"> × {item.quantity || 1}</span>
              </div>
              <span>₹{item.price * (item.quantity || 1)}</span>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₹50</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        {clientSecret && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={finalAmount} />
          </Elements>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Preparing payment...</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/cart')}
        >
          Back to Cart
        </Button>
      </div>
    </div>
  );
};

export default Checkout; 