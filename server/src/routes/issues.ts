import { Router } from 'express';
import { IssueController } from '../controllers/issueController';

const router = Router();

// GET /api/issues - Get all issues with optional filtering
router.get('/', IssueController.getAllIssues);

// GET /api/issues/top - Get top issues by frequency and severity
router.get('/top', IssueController.getTopIssues);

// GET /api/issues/analytics - Get issues with AI analytics
router.get('/analytics', IssueController.getIssuesWithAnalytics);

// GET /api/issues/:id - Get issue by ID
router.get('/:id', IssueController.getIssueById);

// POST /api/issues - Create new issue
router.post('/', IssueController.createIssue);

// PUT /api/issues/:id - Update issue
router.put('/:id', IssueController.updateIssue);

// DELETE /api/issues/:id - Delete issue
router.delete('/:id', IssueController.deleteIssue);

export default router; 