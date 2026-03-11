import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { brandConfigTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { GetBrandResponse, SaveBrandBody, SaveBrandResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function sanitizeBrand(row: typeof brandConfigTable.$inferSelect) {
  return {
    primaryColor: row.primaryColor,
    secondaryColor: row.secondaryColor,
    accentColor: row.accentColor,
    organizationName: row.organizationName,
    ...(row.logoUrl ? { logoUrl: row.logoUrl } : {}),
  };
}

router.get("/brand", async (_req, res) => {
  try {
    const rows = await db.select().from(brandConfigTable).limit(1);
    if (rows.length === 0) {
      const defaults = await db.insert(brandConfigTable).values({
        primaryColor: "#1a3a6b",
        secondaryColor: "#c8a951",
        accentColor: "#ffffff",
        organizationName: "My Team",
      }).returning();
      return res.json(GetBrandResponse.parse(sanitizeBrand(defaults[0])));
    }
    return res.json(GetBrandResponse.parse(sanitizeBrand(rows[0])));
  } catch (err) {
    console.error("Brand GET error:", String(err));
    return res.status(500).json({ error: "Failed to get brand config" });
  }
});

router.put("/brand", async (req, res) => {
  try {
    const body = SaveBrandBody.parse(req.body);
    const existing = await db.select().from(brandConfigTable).limit(1);
    if (existing.length === 0) {
      const created = await db.insert(brandConfigTable).values(body).returning();
      return res.json(SaveBrandResponse.parse(sanitizeBrand(created[0])));
    }
    const updated = await db.update(brandConfigTable)
      .set(body)
      .where(eq(brandConfigTable.id, existing[0].id))
      .returning();
    return res.json(SaveBrandResponse.parse(sanitizeBrand(updated[0])));
  } catch (err) {
    console.error("Brand PUT error:", String(err));
    return res.status(500).json({ error: "Failed to save brand config" });
  }
});

export default router;
