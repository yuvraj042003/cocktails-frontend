import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle2, XCircle, Loader2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  user: {
    name: string;
    email: string;
  };
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getBookings();
      setBookings(response.data.bookings);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      toast({
        title: 'Status Updated',
        description: 'Booking status has been updated successfully.',
      });
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
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
      <div className="p-8 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center text-gray-900 dark:text-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="ml-2 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Table Bookings</h2>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {getStatusIcon(booking.status)}
                <Select
                  defaultValue={booking.status}
                  onValueChange={(value) => handleStatusUpdate(booking._id, value)}
                >
                  <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="pending" className="text-gray-900 dark:text-gray-100">Pending</SelectItem>
                    <SelectItem value="confirmed" className="text-gray-900 dark:text-gray-100">Confirmed</SelectItem>
                    <SelectItem value="cancelled" className="text-gray-900 dark:text-gray-100">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {format(new Date(booking.updatedAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-gray-900 dark:text-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{booking.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{booking.guests} guests</span>
              </div>

              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.user.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{booking.user.email}</p>
              </div>
            </div>

            {booking.specialRequests && (
              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">Special Requests:</span> {booking.specialRequests}
              </p>
            )}

            {booking.statusHistory && booking.statusHistory.length > 0 && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <History className="h-4 w-4" />
                  Status History
                </h4>
                <div className="space-y-2">
                  {booking.statusHistory.map((history, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(history.status as Booking['status'])}`} />
                      <span className="font-medium capitalize">{history.status}</span>
                      <span className="text-gray-500 dark:text-gray-500">
                        {format(new Date(history.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings; 