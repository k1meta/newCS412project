import { ITEM_TYPES } from '../../utils/constants';

const TypeFilter = ({ selected, onChange }) => {
  const types = Object.values(ITEM_TYPES);

  const handleTypeClick = (typeId) => {
    // Only one type can be selected at a time, or none
    if (selected === typeId) {
      onChange(null);
    } else {
      onChange(typeId);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Type</label>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeClick(type.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                selected === type.id
                  ? 'bg-cs-accent text-black'
                  : 'bg-cs-dark border border-gray-600 text-gray-300 hover:border-cs-accent hover:text-cs-accent'
              }`}
            title={type.name}
          >
            {type.shortName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
