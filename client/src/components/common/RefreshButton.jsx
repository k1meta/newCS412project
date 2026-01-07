const RefreshButton = ({ onClick, loading, disabled }) => {
  const isDisabled = loading || disabled;
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`p-2 rounded-lg border border-gray-600 
                  transition-all duration-200
                  ${isDisabled 
                    ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                    : 'bg-cs-dark hover:border-cs-accent hover:text-cs-accent'
                  }`}
      title={disabled ? "Search for items first" : "Refresh items"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
};

export default RefreshButton;
