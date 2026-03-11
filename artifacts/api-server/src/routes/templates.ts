import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { templatesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  GetTemplatesResponse,
  GetTemplateResponse,
  GetTemplateParams,
  CreateTemplateBody,
  DeleteTemplateParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function sanitizeTemplate(r: typeof templatesTable.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    canvasJson: r.canvasJson,
    createdAt: r.createdAt,
    ...(r.thumbnail ? { thumbnail: r.thumbnail } : {}),
  };
}

router.get("/templates", async (_req, res) => {
  try {
    const rows = await db.select().from(templatesTable).orderBy(templatesTable.createdAt);
    const data = GetTemplatesResponse.parse(rows.map(sanitizeTemplate));
    return res.json(data.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error("Templates GET error:", String(err));
    return res.status(500).json({ error: "Failed to get templates" });
  }
});

router.post("/templates", async (req, res) => {
  try {
    const body = CreateTemplateBody.parse(req.body);
    const created = await db.insert(templatesTable).values({
      name: body.name,
      category: body.category,
      canvasJson: body.canvasJson,
      ...(body.thumbnail ? { thumbnail: body.thumbnail } : {}),
    }).returning();
    const validated = GetTemplateResponse.parse(sanitizeTemplate(created[0]));
    return res.status(201).json({ ...validated, createdAt: validated.createdAt.toISOString() });
  } catch (err) {
    console.error("Templates POST error:", String(err));
    return res.status(500).json({ error: "Failed to create template" });
  }
});

router.get("/templates/:id", async (req, res) => {
  try {
    const { id } = GetTemplateParams.parse(req.params);
    const rows = await db.select().from(templatesTable).where(eq(templatesTable.id, id));
    if (rows.length === 0) return res.status(404).json({ error: "Template not found" });
    const validated = GetTemplateResponse.parse(sanitizeTemplate(rows[0]));
    return res.json({ ...validated, createdAt: validated.createdAt.toISOString() });
  } catch (err) {
    console.error("Templates GET/:id error:", String(err));
    return res.status(500).json({ error: "Failed to get template" });
  }
});

router.delete("/templates/:id", async (req, res) => {
  try {
    const { id } = DeleteTemplateParams.parse(req.params);
    await db.delete(templatesTable).where(eq(templatesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    console.error("Templates DELETE error:", String(err));
    return res.status(500).json({ error: "Failed to delete template" });
  }
});

export default router;
