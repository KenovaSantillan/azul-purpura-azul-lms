
export const formatName = (name: string): string => {
  if (!name) return '';
  // Remove accents and non-alphabetic characters except spaces
  const cleanedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, '');

  // Capitalize first letter of each word
  return cleanedName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
