import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    track: z.string(),
    /** parent doc title, for split chapter pages */
    part: z.string().optional(),
    kind: z.enum(['notes', 'questions']).default('notes'),
    /** lower = earlier; the lowest-order notes doc for a track is its landing page */
    order: z.number().default(1),
    /** marked high-yield ("imp") in the source notes */
    imp: z.boolean().default(false),
    /** URL segment for secondary pages: /prep/<track>/<slug> */
    slug: z.string().optional(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
    source: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
