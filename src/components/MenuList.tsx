import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { menuItems, categories, subCategories } from '@/data/menu';

const ITEMS_PER_PAGE = 12;

interface MenuListProps {
  searchQuery?: string;
}

export const MenuList = ({ searchQuery = '' }: MenuListProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Check if the selected category has subcategories
  const hasSubCategories = (category: string): category is keyof typeof subCategories => {
    return category in subCategories;
  };

  // Filter items based on category, subcategory, and search query
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'all' || item.subCategory === selectedSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  const handleAddToCart = (e: React.MouseEvent, item: typeof menuItems[0]) => {
    e.stopPropagation(); // Prevent navigation when clicking the add to cart button
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const handleItemClick = (item: typeof menuItems[0]) => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubCategory('all');
            }}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubCategory('all');
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Subcategory filters */}
        {selectedCategory !== 'all' && hasSubCategories(selectedCategory) && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSubCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedSubCategory('all')}
            >
              All {selectedCategory}
            </Button>
            {subCategories[selectedCategory].map((subCategory: string) => (
              <Button
                key={subCategory}
                variant={selectedSubCategory === subCategory ? 'default' : 'outline'}
                onClick={() => setSelectedSubCategory(subCategory)}
              >
                {subCategory}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedItems.map(item => (
          <div
            key={item.id}
            className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {item.image && (
              <div className="overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {item.isVeg ? (
                  <span className="text-green-600">●</span>
                ) : (
                  <span className="text-red-600">●</span>
                )}
                {item.isBestSeller && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Bestseller
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {item.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">₹{item.price}</span>
                <Button
                  variant="outline"
                  onClick={(e) => handleAddToCart(e, item)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}; 