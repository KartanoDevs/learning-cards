import { Router } from 'express';
import {
  listGroups,
  createGroup,
  updateGroupName,
  hideGroup,
  showGroup,
} from '../controllers/groups.controller';

const router = Router();

router.get('/', listGroups);
router.post('/', createGroup);
router.patch('/:id/name', updateGroupName);
router.post('/:id/hide', hideGroup);
router.post('/:id/show', showGroup);

export default router;
