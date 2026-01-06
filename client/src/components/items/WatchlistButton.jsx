import { useWatchlist } from '../../context/WatchlistContext';

const WatchlistButton = ({ item, size = 'md' }) => {
  const { isInWatchlist, toggleWatchlist, loading } = useWatchlist();
  
  const inWatchlist = isInWatchlist(item.marketplace, item.listing_id);
  
  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWatchlist(item);
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center
                  transition-all duration-200 hover:scale-110
                  ${inWatchlist 
                    ? 'bg-cs-accent text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}
        fill={inWatchlist ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default WatchlistButton;
