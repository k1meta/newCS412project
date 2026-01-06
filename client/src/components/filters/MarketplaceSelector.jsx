import { MARKETPLACES } from '../../utils/constants';

const MarketplaceSelector = ({ selected, onChange }) => {
  const marketplaces = [
    { id: 'all', name: 'All Marketplaces' },
    ...Object.values(MARKETPLACES)
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Marketplace</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                   text-white focus:outline-none focus:border-cs-accent
                   transition-colors cursor-pointer"
      >
        {marketplaces.map((marketplace) => (
          <option key={marketplace.id} value={marketplace.id}>
            {marketplace.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MarketplaceSelector;
