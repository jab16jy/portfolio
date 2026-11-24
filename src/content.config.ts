import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const base = z.object({ title: z.string(), summary: z.string() });
export const collections = {
  projects: defineCollection({
    loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
    schema: base.extend({
      status: z.string(),
      stack: z.array(z.string()),
      finding: z.string(),
      nodes: z.array(z.string()).min(3),
      sources: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
      image: z.string().startsWith("/projects/"),
      imageAlt: z.string().min(1),
      caption: z.string().min(1),
      demo: z.url().optional(),
    }),
  }),
  engineering: defineCollection({
    loader: glob({ base: "./src/content/engineering", pattern: "*.md" }),
    schema: base,
  }),
};
