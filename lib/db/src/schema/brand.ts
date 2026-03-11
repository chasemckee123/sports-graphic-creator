import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const brandConfigTable = pgTable("brand_config", {
  id: serial("id").primaryKey(),
  primaryColor: text("primary_color").notNull().default("#1a3a6b"),
  secondaryColor: text("secondary_color").notNull().default("#c8a951"),
  accentColor: text("accent_color").notNull().default("#ffffff"),
  logoUrl: text("logo_url"),
  organizationName: text("organization_name").notNull().default("My Team"),
});

export const insertBrandConfigSchema = createInsertSchema(brandConfigTable).omit({ id: true });
export type InsertBrandConfig = z.infer<typeof insertBrandConfigSchema>;
export type BrandConfig = typeof brandConfigTable.$inferSelect;
