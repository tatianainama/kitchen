export const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .replace(/\s+/gu, '-')
    .replace(/[^\w-]+/gu, '')
    .replace(/--+/gu, '-');

export default slugify;
