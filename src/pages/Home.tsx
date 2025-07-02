import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MenuList } from '@/components/MenuList'
import OfferSection from '@/components/OfferSection'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&auto=format&fit=crop&q=60"
          alt="Cocktail bar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Cocktails
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Experience the finest cocktails and cuisine in Rewa, Madhya Pradesh
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/menu">View Menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/book">Book a Table</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <OfferSection />

      {/* Menu Preview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Menu</h2>
          <MenuList />
        </div>
      </section>
    </div>
  )
}

export default Home 