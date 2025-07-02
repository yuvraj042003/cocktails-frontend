import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle2, XCircle, Loader2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

interface Booking {
  _id: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: {
    status: string;
    timestamp: string;
  }[];
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching bookings...');
      const response = await api.getMyBookings();
      console.log('Bookings response:', response.data);
      setBookings(response.data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error.response || error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch bookings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.cancelBooking(bookingId);
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground mt-2">Loading your bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container max-w-4xl py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
        <p className="text-muted-foreground mb-8">
          You haven't made any table reservations yet.
        </p>
        <Button asChild>
          <a href="/book">Book a Table</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-16">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-lg p-6 shadow-sm text-gray-900"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className={`font-semibold capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {format(new Date(booking.updatedAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{booking.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>{booking.guests} guests</span>
              </div>
            </div>

            {booking.specialRequests && (
              <p className="mt-4 text-sm text-gray-600">
                Special Requests: {booking.specialRequests}
              </p>
            )}

            {booking.statusHistory && booking.statusHistory.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Status History
                </h4>
                <div className="space-y-2">
                  {booking.statusHistory.map((history, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(history.status as Booking['status'])}`} />
                      <span className="font-medium capitalize">{history.status}</span>
                      <span className="text-gray-400">
                        {format(new Date(history.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {booking.status === 'pending' && (
              <div className="mt-6">
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings; 