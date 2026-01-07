import { useState, useCallback } from 'react';
import FilterSidebar from '../components/filters/FilterSidebar';
import SortDropdown from '../components/filters/SortDropdown';
import ItemGrid from '../components/items/ItemGrid';
import RefreshButton from '../components/common/RefreshButton';
import { itemsApi } from '../services/api';

const SearchPage = () => {
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minFloat: '',
    maxFloat: '',
    conditions: [],
    type: null,
    marketplace: 'all'
  });

  // Sort state
  const [sortBy, setSortBy] = useState('price_asc');

  // Items state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch items
  const fetchItems = useCallback(async (isRefresh = false) => {
    // Require a search term before fetching
    if (!filters.search || filters.search.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = {
        sort: sortBy
      };

      // Add filters to params
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.min_price = Math.round(parseFloat(filters.minPrice) * 100);
      if (filters.maxPrice) params.max_price = Math.round(parseFloat(filters.maxPrice) * 100);
      if (filters.minFloat) params.min_float = parseFloat(filters.minFloat);
      if (filters.maxFloat) params.max_float = parseFloat(filters.maxFloat);
      if (filters.conditions.length > 0) params.conditions = filters.conditions.join(',');
      if (filters.type) params.type = filters.type;
      if (filters.marketplace !== 'all') params.marketplace = filters.marketplace;

      const response = isRefresh 
        ? await itemsApi.refresh(params)
        : await itemsApi.search(params);

      setItems(response.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  // Handle filter change and search
  const handleSearch = () => {
    fetchItems();
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchItems(true);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Only re-fetch if we've already searched
    if (hasSearched && filters.search) {
      setTimeout(() => fetchItems(), 0);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Search Skins</h1>
            <p className="text-gray-400 text-sm mt-1">
              {hasSearched ? `${items.length} items found` : 'Enter a skin name to search'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RefreshButton onClick={handleRefresh} loading={loading} disabled={!hasSearched} />
            <SortDropdown selected={sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Welcome message when no search yet */}
        {!hasSearched && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">
              Search for CS2 Skins
            </h2>
            <p className="text-gray-400 max-w-md">
              Enter an item name in the search bar to find prices across CSFloat, Skinport, and Bitskins.
              Try searching for "AK-47 Redline" or "Karambit Doppler".
            </p>
          </div>
        )}

        {/* Items grid - only show after search */}
        {hasSearched && (
          <ItemGrid
            items={items}
            loading={loading}
            emptyMessage="No skins found. Try adjusting your filters or search term."
          />
        )}
      </main>
    </div>
  );
};

export default SearchPage;
