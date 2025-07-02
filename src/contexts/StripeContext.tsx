import { createContext, useContext, useState, type ReactNode } from 'react';
import * as api from '@/services/api';

interface StripeContextType {
  clientSecret: string | null;
  createPaymentIntent: (amount: number) => Promise<{ clientSecret: string }>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const StripeProvider = ({ children }: { children: ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await api.createPaymentIntent(amount);
      const { clientSecret } = response.data;
      setClientSecret(clientSecret);
      return { clientSecret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  return (
    <StripeContext.Provider
      value={{
        clientSecret,
        createPaymentIntent,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}; 