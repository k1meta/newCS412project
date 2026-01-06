import { SORT_OPTIONS } from '../../utils/constants';

const SortDropdown = ({ selected, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-400 whitespace-nowrap">Sort by</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-cs-dark border border-gray-600 rounded-lg 
                   text-white focus:outline-none focus:border-cs-accent
                   transition-colors cursor-pointer text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
