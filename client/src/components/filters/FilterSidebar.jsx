import SearchBar from './SearchBar';
import PriceFilter from './PriceFilter';
import FloatFilter from './FloatFilter';
import ConditionButtons from './ConditionButtons';
import TypeFilter from './TypeFilter';
import MarketplaceSelector from './MarketplaceSelector';

const FilterSidebar = ({ filters, onFilterChange, onSearch }) => {
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-cs-dark rounded-lg p-4 space-y-6">
      {/* Search */}
      <SearchBar
        value={filters.search}
        onChange={(value) => updateFilter('search', value)}
        onSearch={onSearch}
      />

      {/* Price Filter */}
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onMinChange={(value) => updateFilter('minPrice', value)}
        onMaxChange={(value) => updateFilter('maxPrice', value)}
      />

      {/* Float Filter */}
      <FloatFilter
        minFloat={filters.minFloat}
        maxFloat={filters.maxFloat}
        onMinChange={(value) => updateFilter('minFloat', value)}
        onMaxChange={(value) => updateFilter('maxFloat', value)}
      />

      {/* Condition Buttons */}
      <ConditionButtons
        selected={filters.conditions}
        onChange={(value) => updateFilter('conditions', value)}
      />

      {/* Type Filter */}
      <TypeFilter
        selected={filters.type}
        onChange={(value) => updateFilter('type', value)}
      />

      {/* Marketplace Selector */}
      <MarketplaceSelector
        selected={filters.marketplace}
        onChange={(value) => updateFilter('marketplace', value)}
      />

      {/* Search Button */}
      <button
        onClick={onSearch}
        className="w-full py-3 bg-cs-accent text-black font-semibold rounded-lg
                   hover:bg-yellow-500 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
