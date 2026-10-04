import { Router } from 'express';
import {
  getProjects, getProject, createProject, updateProject, archiveProject, deleteProject, getProjectActivity,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { requireWorkspaceMember } from '../middleware/workspace.js';

const router = Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember());

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:projectId', getProject);
router.patch('/:projectId', updateProject);
router.post('/:projectId/archive', archiveProject);
router.delete('/:projectId', deleteProject);
router.get('/:projectId/activity', getProjectActivity);

export default router;
