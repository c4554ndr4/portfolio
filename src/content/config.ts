import { defineCollection, z } from 'astro:content';

const writeups = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		status: z.enum(['draft', 'published']).default('published'),
	}),
});

export const collections = { writeups };
