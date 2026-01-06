import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-cs-dark border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cs-accent">CS2</span>
            <span className="text-xl text-white">Market Research</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-cs-accent text-black font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Search
            </Link>
            <Link
              to="/watchlist"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/watchlist')
                  ? 'bg-cs-accent text-black font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Watchlist
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
