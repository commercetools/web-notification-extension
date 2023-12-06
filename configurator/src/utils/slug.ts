export const cleanSlug = (input: string): string => {
  return input
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^0-9a-z_-]/g, '')
    .replaceAll('--', '-');
};
