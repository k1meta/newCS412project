import WatchlistButton from './WatchlistButton';
import { formatPrice, formatFloat, getRarityColor, truncateText } from '../../utils/formatters';
import { MARKETPLACES } from '../../utils/constants';

const ItemCard = ({ item }) => {
  const rarityColor = getRarityColor(item.rarity);
  const marketplace = MARKETPLACES[item.marketplace];

  const handleCardClick = () => {
    if (item.listing_url) {
      window.open(item.listing_url, '_blank');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-cs-dark rounded-lg overflow-hidden border border-gray-700 
                 hover:border-gray-500 transition-all duration-200 cursor-pointer
                 hover:transform hover:scale-[1.02] group"
    >
      {/* Rarity color bar */}
      <div
        className="h-1"
        style={{ backgroundColor: rarityColor }}
      />

      {/* Image container */}
      <div className="relative p-4 bg-gradient-to-b from-gray-800/50 to-transparent">
        {/* Watchlist button */}
        <div className="absolute top-2 right-2 z-10">
          <WatchlistButton item={item} size="md" />
        </div>

        {/* Marketplace logo */}
        <div className="absolute bottom-2 right-2">
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center
                          text-xs font-bold text-gray-300" title={marketplace?.name}>
            {item.marketplace?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Item image */}
        <div className="flex items-center justify-center h-32">
          {item.icon_url ? (
            <img
              src={item.icon_url}
              alt={item.market_hash_name}
              className="max-h-full max-w-full object-contain 
                         group-hover:scale-110 transition-transform duration-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="hidden items-center justify-center h-full text-gray-500"
            style={{ display: item.icon_url ? 'none' : 'flex' }}
          >
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Item info */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 
          className="font-medium text-white text-sm leading-tight"
          title={item.market_hash_name}
        >
          {truncateText(item.item_name || item.market_hash_name, 35)}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {/* Rarity tag */}
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: `${rarityColor}30`, color: rarityColor }}
          >
            {item.rarity || 'Unknown'}
          </span>

          {/* StatTrak tag */}
          {item.is_stattrak && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
              StatTrak™
            </span>
          )}

          {/* Souvenir tag */}
          {item.is_souvenir && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
              Souvenir
            </span>
          )}
        </div>

        {/* Price and Float */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-bold text-cs-accent">
              {formatPrice(item.price_cents)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Float</p>
            <p className="text-sm font-mono text-gray-300">
              {item.float_value ? formatFloat(item.float_value).substring(0, 8) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Exterior */}
        <div className="text-xs text-gray-400 text-center">
          {item.exterior || 'Unknown Condition'}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
