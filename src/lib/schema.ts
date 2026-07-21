import { z } from "zod";

export const generationSettingsSchema = z.object({
  category: z.enum(["auto", "physics", "chemistry", "biology", "earth", "space"]),
  style: z.enum(["infographic", "cinematic", "photorealistic", "textbook", "futuristic"]),
  aspectRatio: z.enum(["16:9", "4:5", "1:1", "9:16"]),
  complexity: z.enum(["general", "student", "advanced"]),
  labelDensity: z.enum(["minimal", "standard", "detailed"]),
  language: z.enum(["en", "ko", "ja"]),
  includeLabels: z.boolean(),
  includeExplanation: z.boolean(),
  includeNegativePrompt: z.boolean(),
  includeSimplifiedPrompt: z.boolean(),
  includeInfographicPrompt: z.boolean(),
});

export const generationResultSchema = z.object({
  title: z.string(),
  detectedCategory: z.enum(["physics", "chemistry", "biology", "earth", "space"]),
  matchedSlug: z.string().nullable(),
  matchConfidence: z.enum(["profile", "fallback"]),
  // Optional with a default so history saved before this field existed still validates.
  relatedSlugs: z.array(z.string()).optional().default([]),
  overview: z.string(),
  cause: z.string(),
  mechanism: z.string(),
  result: z.string(),
  visualizationStrategy: z.string(),
  visualElements: z.array(z.string()),
  labels: z.array(z.string()),
  annotations: z.array(z.string()),
  explanationParagraph: z.string(),
  finalPrompt: z.string(),
  negativePrompt: z.string(),
  simplifiedPrompt: z.string(),
  infographicPrompt: z.string(),
  cautions: z.string(),
});

export const historyEntrySchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  input: z.string(),
  settings: generationSettingsSchema,
  result: generationResultSchema,
  favorite: z.boolean(),
});

export const historyArraySchema = z.array(historyEntrySchema);
