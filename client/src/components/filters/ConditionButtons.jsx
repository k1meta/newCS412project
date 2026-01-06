import { CONDITIONS } from '../../utils/constants';

const ConditionButtons = ({ selected, onChange }) => {
  const conditions = Object.values(CONDITIONS);

  const toggleCondition = (conditionId) => {
    if (selected.includes(conditionId)) {
      onChange(selected.filter((id) => id !== conditionId));
    } else {
      onChange([...selected, conditionId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Condition</label>
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => (
          <button
            key={condition.id}
            onClick={() => toggleCondition(condition.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                selected.includes(condition.id)
                  ? 'bg-cs-accent text-black'
                  : 'bg-cs-dark border border-gray-600 text-gray-300 hover:border-cs-accent hover:text-cs-accent'
              }`}
            title={condition.name}
          >
            {condition.shortName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConditionButtons;
