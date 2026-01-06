import { useState, useEffect } from 'react';
import FilterSidebar from '../components/filters/FilterSidebar';
import SortDropdown from '../components/filters/SortDropdown';
import ItemGrid from '../components/items/ItemGrid';
import RefreshButton from '../components/common/RefreshButton';
import { useWatchlist } from '../context/WatchlistContext';

const WatchlistPage = () => {
  const { watchlist, loading, error, refreshWatchlist, fetchWatchlist } = useWatchlist();

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

  // Filtered and sorted items
  const [displayItems, setDisplayItems] = useState([]);

  // Apply filters and sorting to watchlist
  useEffect(() => {
    let filtered = [...watchlist];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.market_hash_name?.toLowerCase().includes(searchLower) ||
        item.item_name?.toLowerCase().includes(searchLower)
      );
    }

    // Price filters
    if (filters.minPrice) {
      const minCents = Math.round(parseFloat(filters.minPrice) * 100);
      filtered = filtered.filter(item => item.price_cents >= minCents);
    }
    if (filters.maxPrice) {
      const maxCents = Math.round(parseFloat(filters.maxPrice) * 100);
      filtered = filtered.filter(item => item.price_cents <= maxCents);
    }

    // Float filters
    if (filters.minFloat) {
      const minFloat = parseFloat(filters.minFloat);
      filtered = filtered.filter(item => 
        item.float_value === null || item.float_value >= minFloat
      );
    }
    if (filters.maxFloat) {
      const maxFloat = parseFloat(filters.maxFloat);
      filtered = filtered.filter(item => 
        item.float_value === null || item.float_value <= maxFloat
      );
    }

    // Condition filters
    if (filters.conditions.length > 0) {
      filtered = filtered.filter(item => {
        const exterior = item.exterior?.toLowerCase() || '';
        return filters.conditions.some(cond => {
          switch (cond.toLowerCase()) {
            case 'fn': return exterior.includes('factory new');
            case 'mw': return exterior.includes('minimal wear');
            case 'ft': return exterior.includes('field-tested');
            case 'ww': return exterior.includes('well-worn');
            case 'bs': return exterior.includes('battle-scarred');
            default: return false;
          }
        });
      });
    }

    // Type filter
    if (filters.type) {
      switch (filters.type.toLowerCase()) {
        case 'stattrak':
          filtered = filtered.filter(item => item.is_stattrak);
          break;
        case 'souvenir':
          filtered = filtered.filter(item => item.is_souvenir);
          break;
        case 'normal':
          filtered = filtered.filter(item => !item.is_stattrak && !item.is_souvenir);
          break;
      }
    }

    // Marketplace filter
    if (filters.marketplace !== 'all') {
      filtered = filtered.filter(item => item.marketplace === filters.marketplace);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
        break;
      case 'float_asc':
        filtered.sort((a, b) => (a.float_value || 0) - (b.float_value || 0));
        break;
      case 'float_desc':
        filtered.sort((a, b) => (b.float_value || 0) - (a.float_value || 0));
        break;
    }

    setDisplayItems(filtered);
  }, [watchlist, filters, sortBy]);

  // Handle refresh (removes stale items)
  const handleRefresh = async () => {
    try {
      const result = await refreshWatchlist();
      if (result.removed > 0) {
        alert(`${result.removed} item(s) were removed because they are no longer available.`);
      }
    } catch (err) {
      console.error('Error refreshing watchlist:', err);
    }
  };

  // Handle filter search (just applies filters locally)
  const handleSearch = () => {
    // Filters are applied automatically via useEffect
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
            <h1 className="text-2xl font-bold text-white">
              <span className="inline-flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-cs-accent"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Watchlist
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {displayItems.length} of {watchlist.length} items
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RefreshButton onClick={handleRefresh} loading={loading} />
            <SortDropdown selected={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 p-4 bg-cs-dark border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-sm">
            <span className="text-cs-accent font-medium">Tip:</span> Click the refresh button to check if your watchlisted items are still available. 
            Items that have been sold or removed will be automatically deleted.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Items grid */}
        <ItemGrid
          items={displayItems}
          loading={loading}
          emptyMessage="Your watchlist is empty. Add items from the search page!"
        />
      </main>
    </div>
  );
};

export default WatchlistPage;
