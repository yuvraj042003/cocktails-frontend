import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { menuItems } from '@/data/menu';
import { Star, StarHalf, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { productApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  image?: string;
  isVeg: boolean;
  isBestSeller: boolean;
  reviews: Review[];
  averageRating: number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<typeof menuItems>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product details from API or fallback to local data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to fetch from API first
        const response = await productApi.getProductById(id!);
        setProduct(response.data);
      } catch (error) {
        // Fallback to local data if API fails
        const localProduct = menuItems.find(item => item.id === id);
        if (localProduct) {
          // Convert local data to match API format
          setProduct({
            ...localProduct,
            reviews: [],
            averageRating: 0,
            // Ensure required fields have values
            description: localProduct.description || '',
            isVeg: localProduct.isVeg || false,
            isBestSeller: localProduct.isBestSeller || false,
          });
          
          // Find related products (same category)
          const related = menuItems
            .filter(item => item.category === localProduct.category && item.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          // Product not found, redirect to menu
          navigate('/menu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
      });
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: "Review required",
        description: "Please enter a comment for your review",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReview(true);
      
      // Include product details in case the product needs to be created in the database
      await productApi.addReview(id!, {
        rating: reviewRating,
        comment: reviewComment,
        productName: product.name,
        productDescription: product.description,
        productPrice: product.price,
        productCategory: product.category,
        productImage: product.image,
        isVeg: product.isVeg,
        isBestSeller: product.isBestSeller
      });

      // Refresh product data to show new review
      const response = await productApi.getProductById(id!);
      setProduct(response.data);
      
      // Reset form
      setReviewComment('');
      setReviewRating(5);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting review",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Render star rating based on a numeric value
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-500" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-500" size={18} />);
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-xl">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {product.image ? (
            <div className="overflow-hidden h-[400px]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              {product.isVeg ? (
                <span className="text-green-600 text-2xl">●</span>
              ) : (
                <span className="text-red-600 text-2xl">●</span>
              )}
              {product.isBestSeller && (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
            </div>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-500">
                {renderStarRating(product.averageRating || 0)}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            <p className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">₹{product.price}</p>
          </div>

          <div className="border-t border-b py-4 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Quantity:</span>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
            >
              Buy Now
            </Button>
          </div>

          <div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-2 ${activeTab === 'description' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === 'description' ? (
                <p className="text-muted-foreground">
                  {product.description || 'No description available for this product.'}
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Review Form */}
                  {user && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-2">Write a Review</h3>
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <span className="mr-2">Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star 
                                  className={star <= reviewRating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
                                  size={24} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Share your thoughts about this product..."
                          value={reviewComment}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button 
                        onClick={handleReviewSubmit} 
                        disabled={submittingReview || !reviewComment.trim()}
                      >
                        {submittingReview ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{review.userName}</p>
                              <div className="flex text-yellow-500 mt-1">
                                {renderStarRating(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-2 text-muted-foreground">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800" onClick={() => navigate(`/product/${item.id}`)}>
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{item.name}</CardTitle>
                    {item.isVeg ? (
                      <span className="text-green-600">●</span>
                    ) : (
                      <span className="text-red-600">●</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm">
                    {item.description?.substring(0, 60)}
                    {item.description && item.description.length > 60 ? '...' : ''}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">₹{item.price}</span>
                  <Button variant="outline" size="sm">View</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 