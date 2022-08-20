import { Recipe as RecipeJsonLd } from 'schema-dts';

export const parseFromJsonLd = ($: cheerio.Root): RecipeJsonLd => {
  const jsonData = $('script[type="application/ld+json"]').html();
  const data = JSON.parse(jsonData);

  return data.length
    ? data.find((schema) => schema['@type'] === 'Recipe')
    : data;
};

// eslint-disable-next-line no-confusing-arrow
export const sanitizeInstructions = (JsonLdInstructions: unknown): string[] =>
  Array.isArray(JsonLdInstructions)
    ? JsonLdInstructions.map((instruction) => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (instruction['@type'] === 'HowToStep') {
          return instruction.text;
        }
        return '';
      })
    : [];
