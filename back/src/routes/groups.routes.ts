import { Router } from 'express';
import {
  listGroups,
  createGroup,
  updateGroupName, // (Dejamos esta por si la usa otra cosa)
  updateGroup,   // <-- 1. IMPORTA LA NUEVA FUNCIÓN
  hideGroup,
  showGroup,
} from '../controllers/groups.controller';

const router = Router();

router.get('/', listGroups);
router.post('/', createGroup);
router.patch('/:id/name', updateGroupName); // (Dejamos esta por si acaso)
router.patch('/:id', updateGroup);           // <-- 2. AÑADE ESTA LÍNEA (la que usa Angular)
router.post('/:id/hide', hideGroup);
router.post('/:id/show', showGroup);

export default router;