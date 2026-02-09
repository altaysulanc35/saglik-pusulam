import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't strictly need tables for this stateless app, but we'll keep the structure.
// Maybe a feedback table?
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  isPositive: boolean("is_positive").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  message: true,
  isPositive: true
});

// === API CONTRACT TYPES ===

// Symptom Analysis
export const analyzeSymptomSchema = z.object({
  symptom: z.string().min(3, "Lütfen en az 3 karakter giriniz"),
});

export const analysisResponseSchema = z.object({
  department: z.string(),
  explanation: z.string(),
  urgency: z.enum(["low", "medium", "high", "emergency"]),
  relatedSymptoms: z.array(z.string()).optional(),
});

// Hospital Search
export const searchHospitalsSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().default(5000), // meters
});

export const hospitalSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  distance: z.number().optional(), // meters
});

export const hospitalsListSchema = z.array(hospitalSchema);

export type AnalyzeSymptomRequest = z.infer<typeof analyzeSymptomSchema>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type SearchHospitalsRequest = z.infer<typeof searchHospitalsSchema>;
export type Hospital = z.infer<typeof hospitalSchema>;
