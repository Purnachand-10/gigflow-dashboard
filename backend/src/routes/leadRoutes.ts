import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads
} from '../controllers/leadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getLeads)
  .post(protect, admin, createLead);

router.get('/export', protect, admin, exportLeads);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, admin, deleteLead);

export default router;
