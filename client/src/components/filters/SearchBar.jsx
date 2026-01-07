import { useState, useRef, useEffect } from 'react';
import itemNames from '../../data/itemNames.json';

const SearchBar = ({ value, onChange, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (value.length >= 2) {
      const searchTerm = value.toLowerCase();
      const filtered = itemNames
        .filter(name => name.toLowerCase().includes(searchTerm))
        .slice(0, 10); // Limit to 10 suggestions
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        onSearch?.();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          setShowDropdown(false);
          onSearch?.();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    setSelectedIndex(-1);
    // Trigger search after selecting
    setTimeout(() => onSearch?.(), 0);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (value.length >= 2 && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder="Search for item... (e.g. AK-47 Redline)"
        className="w-full px-4 py-3 bg-cs-dark border border-gray-600 rounded-lg 
                   text-white placeholder-gray-400 focus:outline-none focus:border-cs-accent
                   transition-colors"
        autoComplete="off"
      />
      <button
        onClick={() => {
          setShowDropdown(false);
          onSearch?.();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                   hover:text-cs-accent transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-cs-dark border border-gray-600 
                     rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors
                ${index === selectedIndex 
                  ? 'bg-cs-accent text-black' 
                  : 'text-white hover:bg-gray-700'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {highlightMatch(suggestion, value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to highlight matching text
const highlightMatch = (text, query) => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return text;
  
  return (
    <>
      {text.slice(0, index)}
      <span className="font-bold text-cs-accent">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
};

export default SearchBar;
