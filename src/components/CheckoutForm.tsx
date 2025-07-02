import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe as useStripeElements,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useStripe } from '@/contexts/StripeContext';

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm = ({ amount }: CheckoutFormProps) => {
  const stripe = useStripeElements();
  const elements = useElements();
  const { createPaymentIntent } = useStripe();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create a payment intent
      await createPaymentIntent(amount);

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message || 'An error occurred during payment.',
          variant: 'destructive',
        });
      } else if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your order!',
        });
        navigate('/payment-success');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during payment processing.',
        variant: 'destructive',
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
    </form>
  );
};

export default CheckoutForm; 