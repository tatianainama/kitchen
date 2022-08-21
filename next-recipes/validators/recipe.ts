import { UnitName } from '@prisma/client';
import { z } from 'zod';

export const recipeSchema = z.object({
  name: z.string().min(1, { message: 'Name cannot be empty' }).trim(),
  slug: z.string(),
  summary: z.string().trim().optional(),
  image: z.string().optional(),
  imageBlog: z.string().nullish(),
  url: z.string().optional(),
  prepTime: z.string().default('P0H0M'),
  cookTime: z.string().default('P0H0M'),
  totalTime: z.string().default('P0H0M'),
  yields: z.number().nonnegative(),
  serves: z.string().optional(),
  tags: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string()
    })
  ),
  courses: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string()
    })
  ),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        group: z.string().default(''),
        quantity: z.number().default(0),
        unit: z.nativeEnum(UnitName).nullable(),
        note: z.string().optional(),
        original: z.string().optional()
      })
    )
    .min(1),
  instructions: z.array(z.string()),
  author: z
    .object({
      website: z.string(),
      name: z.string()
    })
    .optional()
});

export type RecipeSchema = z.infer<typeof recipeSchema>;
