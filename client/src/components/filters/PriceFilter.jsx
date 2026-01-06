const PriceFilter = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Price Range (USD)</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cs-accent
                     transition-colors text-sm"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cs-accent
                     transition-colors text-sm"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
