import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // direct, global, enterprise, tertiary
  location: text("location").notNull(),
  employees: integer("employees"),
  funding: text("funding"),
  revenue: text("revenue"),
  description: text("description").notNull(),
  similarity: integer("similarity").notNull(), // 1-10 scale
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  killPoints: text("kill_points").array(),
  landmineQuestions: text("landmine_questions").array(),
  capabilities: jsonb("capabilities"), // JSON object for capability matrix
  pricing: text("pricing"),
  targetMarket: text("target_market"),
  implementationTime: text("implementation_time"),
  uniqueFeatures: text("unique_features").array(),
});

export const capabilities = pgTable("capabilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // pre-season, in-season, analytics
});

export const marketSegments = pgTable("market_segments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  competitors: text("competitors").array(),
  characteristics: text("characteristics").array(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
});

export const insertCapabilitySchema = createInsertSchema(capabilities).omit({
  id: true,
});

export const insertMarketSegmentSchema = createInsertSchema(marketSegments).omit({
  id: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

export type InsertCapability = z.infer<typeof insertCapabilitySchema>;
export type Capability = typeof capabilities.$inferSelect;

export type InsertMarketSegment = z.infer<typeof insertMarketSegmentSchema>;
export type MarketSegment = typeof marketSegments.$inferSelect;
