import { z } from 'zod';

export const TranslationSchema = z.object({
  language_code: z.string(),
  title: z.string(),
  Category: z.string().optional(),
});

export const PronunciationSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  tags: z.preprocess(
    (arg) => (arg === null ? undefined : arg),
    z.array(z.string()).optional().default([])
  ).transform(tags => tags.filter(tag => tag.length > 0)),
  translation: z.preprocess(
    (arg) => (arg === null ? undefined : arg),
    TranslationSchema.optional()
  ),
});

export const PronunciationResponseSchema = z.array(PronunciationSchema);
