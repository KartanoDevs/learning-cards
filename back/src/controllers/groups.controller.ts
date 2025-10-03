import { Request, Response } from 'express';
import { Group } from '../models/Group';
import { asyncHandler } from '../utils/asyncHandler';
import { isValidObjectId } from '../utils/validateObjectId';

// GET /api/groups?enabled=true
export const listGroups = asyncHandler(async (req: Request, res: Response) => {
  const { enabled } = req.query as { enabled?: string };
  const filter: any = {};
  if (enabled !== undefined) filter.enabled = enabled === 'true';

  const groups = await Group.find(filter).sort({ order: 1, name: 1 });
  res.json({ ok: true, data: groups });
});

// POST /api/groups
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, iconUrl, order, enabled } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ ok: false, message: 'name y slug son obligatorios' });
  }

  const group = await Group.create({
    name: String(name).trim(),
    slug: String(slug).trim().toLowerCase(),
    iconUrl: iconUrl ?? null,
    order: typeof order === 'number' ? order : 0,
    enabled: enabled ?? true,
  });

  res.status(201).json({ ok: true, data: group });
});

// PATCH /api/groups/:id/name
export const updateGroupName = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }
  if (!name) {
    return res.status(400).json({ ok: false, message: 'name es obligatorio' });
  }

  const updated = await Group.findByIdAndUpdate(id, { name: String(name).trim() }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});

// POST /api/groups/:id/hide  (enabled=false)
export const hideGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Group.findByIdAndUpdate(id, { enabled: false }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});

// POST /api/groups/:id/show  (enabled=true)
export const showGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Group.findByIdAndUpdate(id, { enabled: true }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});
