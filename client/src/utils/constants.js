// CS2 Skin Conditions
export const CONDITIONS = {
  FN: { id: 'fn', name: 'Factory New', shortName: 'FN', minFloat: 0.00, maxFloat: 0.07 },
  MW: { id: 'mw', name: 'Minimal Wear', shortName: 'MW', minFloat: 0.07, maxFloat: 0.15 },
  FT: { id: 'ft', name: 'Field-Tested', shortName: 'FT', minFloat: 0.15, maxFloat: 0.38 },
  WW: { id: 'ww', name: 'Well-Worn', shortName: 'WW', minFloat: 0.38, maxFloat: 0.45 },
  BS: { id: 'bs', name: 'Battle-Scarred', shortName: 'BS', minFloat: 0.45, maxFloat: 1.00 }
};

// CS2 Rarity colors and names
export const RARITIES = {
  consumer: { name: 'Consumer Grade', color: '#b0c3d9' },
  industrial: { name: 'Industrial Grade', color: '#5e98d9' },
  milspec: { name: 'Mil-Spec', color: '#4b69ff' },
  restricted: { name: 'Restricted', color: '#8847ff' },
  classified: { name: 'Classified', color: '#d32ce6' },
  covert: { name: 'Covert', color: '#eb4b4b' },
  contraband: { name: 'Contraband', color: '#e4ae39' }
};

// Available marketplaces
export const MARKETPLACES = {
  csfloat: { id: 'csfloat', name: 'CSFloat', logo: '/marketplace-logos/csfloat.png' },
  skinport: { id: 'skinport', name: 'Skinport', logo: '/marketplace-logos/skinport.png' },
  bitskins: { id: 'bitskins', name: 'Bitskins', logo: '/marketplace-logos/bitskins.png' }
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'float_asc', label: 'Float: Low → High' },
  { value: 'float_desc', label: 'Float: High → Low' }
];

// Item type filters
export const ITEM_TYPES = {
  stattrak: { id: 'stattrak', name: 'StatTrak', shortName: 'ST' },
  souvenir: { id: 'souvenir', name: 'Souvenir', shortName: 'SV' },
  normal: { id: 'normal', name: 'Normal', shortName: 'NOR' }
};
