const FloatFilter = ({ minFloat, maxFloat, onMinChange, onMaxChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Float Range</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={minFloat}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min (0.00)"
          min="0"
          max="1"
          step="0.0001"
          className="w-full px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cs-accent
                     transition-colors text-sm"
        />
        <input
          type="number"
          value={maxFloat}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max (1.00)"
          min="0"
          max="1"
          step="0.0001"
          className="w-full px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cs-accent
                     transition-colors text-sm"
        />
      </div>
    </div>
  );
};

export default FloatFilter;
