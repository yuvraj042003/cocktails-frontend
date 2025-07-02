import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { menuItems } from "@/data/menu";
import type { MenuItem } from "@/data/menu";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 0) {
      const searchTerm = query.toLowerCase();
      const filtered = menuItems.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm);
        const categoryMatch = item.category.toLowerCase().includes(searchTerm);
        const descriptionMatch = item.description?.toLowerCase().includes(searchTerm);
        return nameMatch || categoryMatch || descriptionMatch;
      });
      setSuggestions(filtered);
      setShowSuggestions(true);
      // Call onSearch prop if provided
      onSearch?.(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch?.("");
    }
  }, [query, onSearch]);

  const handleItemClick = (item: MenuItem) => {
    setQuery(item.name);
    setShowSuggestions(false);
    // Navigate to menu page with search params
    navigate(`/menu?search=${encodeURIComponent(item.name)}&category=${encodeURIComponent(item.category)}`);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Input
        type="text"
        placeholder="Search menu items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicking them
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-3"
              onClick={() => handleItemClick(item)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <div className="font-medium flex items-center gap-2">
                  {item.name}
                  {item.isVeg !== undefined && (
                    <span className={item.isVeg ? "text-green-600" : "text-red-600"}>
                      ●
                    </span>
                  )}
                  {item.isBestSeller && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                      Bestseller
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>{item.category}</span>
                  <span className="font-medium">₹{item.price}</span>
                </div>
                {item.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 