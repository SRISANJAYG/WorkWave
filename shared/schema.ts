import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Worker profiles table
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  skill: text("skill").notNull(),
  location: text("location").notNull(),
  languages: text("languages").array().notNull().default(sql`ARRAY[]::text[]`),
  experience: text("experience").notNull(),
  workingHours: text("working_hours").notNull(),
  photoUrl: text("photo_url"),
  portfolioLinks: text("portfolio_links").array().notNull().default(sql`ARRAY[]::text[]`),
  bio: text("bio").notNull(),
  slogan: text("slogan").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// For local development we provide a zod schema for inserting profiles so the
// server can validate incoming data without requiring the optional
// `drizzle-zod` package. This mirrors the shape of the table but omits
// server-managed fields like `id` and `createdAt`.
export const insertProfileSchema = z.object({
  name: z.string(),
  skill: z.string(),
  location: z.string(),
  languages: z.array(z.string()).optional().default([]),
  experience: z.string(),
  workingHours: z.string(),
  photoUrl: z.string().nullable().optional(),
  portfolioLinks: z.array(z.string()).optional().default([]),
  bio: z.string(),
  slogan: z.string(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  isPublic: z.boolean().optional().default(false),
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
