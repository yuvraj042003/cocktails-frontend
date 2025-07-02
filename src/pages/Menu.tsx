import { useState } from 'react';
import { MenuList } from '@/components/MenuList';
import SearchBar from '@/components/SearchBar';
import { useSearchParams } from 'react-router-dom';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-center mb-2">Our Menu</h1>
        <p className="text-muted-foreground text-center mb-4">
          Discover our delicious selection of dishes
        </p>
        <div className="max-w-md mx-auto px-4 mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <MenuList searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Menu; 