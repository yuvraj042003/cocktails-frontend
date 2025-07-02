import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import * as api from "@/services/api";

interface BookingFormData {
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

const BookTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    time: "",
    guests: 1,
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.bookTable(formData);
      
      toast({
        title: "Booking Created!",
        description: "Your table has been booked successfully.",
      });
      
      // Navigate to bookings page
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }));
  };

  return (
    <div className="container max-w-2xl py-16">
      <div className="bg-white rounded-lg p-6 shadow-lg text-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Table</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1 text-gray-900">
                Date
              </label>
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1 text-gray-900">
                Time
              </label>
              <Input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-white text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="guests" className="block text-sm font-medium mb-1 text-gray-900">
              Number of Guests
            </label>
            <Input
              id="guests"
              type="number"
              name="guests"
              placeholder="Number of Guests"
              min="1"
              max="20"
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium mb-1 text-gray-900">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Any special requests or dietary requirements?"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-white text-gray-900"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Booking..." : "Book Now"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookTable; 