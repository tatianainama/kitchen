export const slugify = (name: string) => name.replaceAll(
  " ",
  "-"
);

export default slugify;
