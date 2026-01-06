// Format price from cents to dollars
export const formatPrice = (cents) => {
  if (cents === null || cents === undefined) return 'N/A';
  return `$${(cents / 100).toFixed(2)}`;
};

// Format float value to 10 decimal places
export const formatFloat = (floatValue) => {
  if (floatValue === null || floatValue === undefined) return 'N/A';
  return parseFloat(floatValue).toFixed(10);
};

// Get condition name from float value
export const getConditionFromFloat = (floatValue) => {
  if (floatValue < 0.07) return 'Factory New';
  if (floatValue < 0.15) return 'Minimal Wear';
  if (floatValue < 0.38) return 'Field-Tested';
  if (floatValue < 0.45) return 'Well-Worn';
  return 'Battle-Scarred';
};

// Get condition short name from float value
export const getConditionShortName = (floatValue) => {
  if (floatValue < 0.07) return 'FN';
  if (floatValue < 0.15) return 'MW';
  if (floatValue < 0.38) return 'FT';
  if (floatValue < 0.45) return 'WW';
  return 'BS';
};

// Get rarity color
export const getRarityColor = (rarity) => {
  const colors = {
    consumer: '#b0c3d9',
    industrial: '#5e98d9',
    milspec: '#4b69ff',
    restricted: '#8847ff',
    classified: '#d32ce6',
    covert: '#eb4b4b',
    contraband: '#e4ae39'
  };
  return colors[rarity?.toLowerCase()] || '#b0c3d9';
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
