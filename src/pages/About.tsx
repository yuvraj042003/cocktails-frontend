const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-16">
        <div className="absolute inset-0">
          <img
            src="data:image/jpeg;base64,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"
            alt="Restaurant interior"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Experience the perfect blend of tradition and innovation at Cocktails Restro & Beer Bar
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Our Story Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Welcome to Cocktails Restro & Beer Bar, Rewa's premier destination for 
                exceptional cocktails, craft beers, and delicious food. Established in 2023, 
                we've quickly become a favorite spot for locals and visitors alike, offering 
                a perfect blend of modern ambiance and traditional hospitality.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2069&auto=format&fit=crop"
                alt="Cocktail preparation"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Our Philosophy Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[400px] rounded-lg overflow-hidden order-2 md:order-1">
              <img
                src="https://img.restaurantguru.com/rb5a-the-cocktails-bar-and-restaurant-interior.jpg"
                alt="Restaurant atmosphere"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <h2 className="text-3xl font-bold">Our Philosophy</h2>
              <p className="text-muted-foreground">
                We believe in creating memorable experiences through quality drinks, 
                excellent food, and outstanding service. Our expert mixologists craft 
                each cocktail with precision and creativity, while our chefs prepare 
                dishes that perfectly complement your drinks.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <div className="h-48">
                <img
                  src="https://img.restaurantguru.com/r3f5-design-the-cocktails-bar-and-restaurant-2024-04.jpg"
                  alt="Quality Ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
                <p className="text-muted-foreground">
                  We source the finest ingredients and spirits to ensure every drink 
                  meets our high standards.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <div className="h-48">
                <img
                  src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=2787&auto=format&fit=crop"
                  alt="Expert Staff"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Expert Staff</h3>
                <p className="text-muted-foreground">
                  Our team of skilled bartenders and chefs are passionate about 
                  their craft and dedicated to your satisfaction.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <div className="h-48">
                <img
                  src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2787&auto=format&fit=crop"
                  alt="Welcoming Atmosphere"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Welcoming Atmosphere</h3>
                <p className="text-muted-foreground">
                  We've created a warm and inviting space where you can relax 
                  and enjoy great company.
                </p>
              </div>
            </div>
          </section>

          {/* Visit Us Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Visit Us</h2>
              <p className="text-muted-foreground">
                Located in the heart of Rewa, Madhya Pradesh, we're open daily from 
                11 AM to 11 PM. Whether you're planning a casual evening out, a 
                special celebration, or a business meeting, we're here to make your 
                experience memorable.
              </p>
              <div className="pt-4">
                <p className="font-semibold">Hours:</p>
                <p className="text-muted-foreground">Monday - Sunday: 11:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586999768265-24af89630739?q=80&w=2787&auto=format&fit=crop"
                alt="Restaurant exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 