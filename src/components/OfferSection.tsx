import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfferSection = () => {
  const offers = [
    {
      id: 1,
      title: "Happy Hours Special",
      description: "30% off on all drinks between 4 PM - 7 PM",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60",
      tag: "Limited Time"
    },
    {
      id: 2,
      title: "Weekend Brunch",
      description: "Complimentary mocktail with every brunch combo",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60",
      tag: "Weekends Only"
    },
    {
      id: 3,
      title: "Group Celebration",
      description: "20% off on group bookings of 8 or more",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
      tag: "Special Offer"
    }
  ];
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {offer.tag}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                <p className="mb-4 text-sm text-gray-200">{offer.description}</p>
                <Button variant="secondary" className="group">
                  Claim Offer
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection; 