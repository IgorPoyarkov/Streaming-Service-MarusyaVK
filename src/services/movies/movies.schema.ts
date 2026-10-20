import { z } from "zod";

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  originalTitle: z.string().nullable().optional(),
  language: z.string(),
  releaseYear: z.number().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  genres: z.array(z.string()),
  plot: z.string().nullable().optional(),
  runtime: z.number().nullable().optional(),
  budget: z.string().nullable().optional(),
  revenue: z.string().nullable().optional(),
  homepage: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  posterUrl: z.string().nullable().optional(),
  backdropUrl: z.string().nullable().optional(),
  trailerUrl: z.string().nullable().optional(),
  trailerYouTubeId: z.string().nullable().optional(),
  tmdbRating: z.number().nullable().optional(),
  searchL: z.string().nullable().optional(),
  keywords: z.array(z.string()).optional(),
  countriesOfOrigin: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  cast: z.array(z.string()).optional(),
  director: z.string().nullable().optional(),
  production: z.string().nullable().optional(),
  awardsSummary: z.string().nullable().optional(),
});

export type Movie = z.infer<typeof MovieSchema>;

export const MovieDetailsSchema = MovieSchema.pick({
  language: true,
  budget: true,
  revenue: true,
  director: true,
  production: true,
  awardsSummary: true,
});

export type MovieDetails = z.infer<typeof MovieDetailsSchema>;


