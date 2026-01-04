import { defineCollection, z } from 'astro:content';

const writeups = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional().default(''),
		date: z.union([z.date(), z.string()]).optional(),
		status: z.enum(['draft', 'published']).default('published'),
	}),
});

export const collections = { writeups };
