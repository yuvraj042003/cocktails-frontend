import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.login({ email, password });
      console.log('Login response:', response.data);
      
      const { token, ...userData } = response.data;
      
      if (!token) {
        console.error('No token received in login response');
        toast({
          title: 'Login failed',
          description: 'Authentication token not received',
          variant: 'destructive',
        });
        throw new Error('No authentication token received');
      }
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({ name, email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      
      toast({
        title: 'Registration successful',
        description: `Welcome, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Could not create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await api.updateProfile(data);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Could not update profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 