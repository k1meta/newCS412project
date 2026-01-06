import { useState, useEffect, useCallback } from 'react';
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

  // Fetch items
  const fetchItems = useCallback(async (isRefresh = false) => {
    setLoading(true);
    setError(null);

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

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, []);

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
    // Re-fetch with new sort
    setTimeout(() => fetchItems(), 0);
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
              {items.length} items found
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RefreshButton onClick={handleRefresh} loading={loading} />
            <SortDropdown selected={sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Items grid */}
        <ItemGrid
          items={items}
          loading={loading}
          emptyMessage="No skins found. Try adjusting your filters or click refresh."
        />
      </main>
    </div>
  );
};

export default SearchPage;
