import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  useEffect(() => {
    // Clear cart or perform other post-payment actions here
  }, []);

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        
        <p className="text-muted-foreground text-lg">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        <div className="text-left bg-card p-6 rounded-lg shadow-sm my-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• You will receive an email confirmation shortly</li>
            <li>• Your order will be prepared according to the scheduled time</li>
            <li>• You can view your order details in your profile</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/orders">View Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/menu">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 