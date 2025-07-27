import { Request, Response } from 'express';
import { IssueModel, Issue } from '../models/Issue';

export class IssueController {
  // Get all issues
  static async getAllIssues(req: Request, res: Response): Promise<void> {
    try {
      const { source, status, severity, limit, offset } = req.query;
      
      const filters = {
        source: source as string,
        status: status as string,
        severity: severity ? parseInt(severity as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      };

      const issues = await IssueModel.findAll(filters);
      res.json({
        success: true,
        data: issues,
        count: issues.length
      });
    } catch (error) {
      console.error('Error fetching issues:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get issue by ID
  static async getIssueById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid issue ID'
        });
        return;
      }

      const issue = await IssueModel.findById(id);
      
      if (!issue) {
        res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
        return;
      }

      res.json({
        success: true,
        data: issue
      });
    } catch (error) {
      console.error('Error fetching issue:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new issue
  static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, source, source_id, severity, frequency, status, tags, type, jira_exists } = req.body;

      // Validation
      if (!title || !source) {
        res.status(400).json({
          success: false,
          message: 'Title and source are required'
        });
        return;
      }

      if (severity && (severity < 1 || severity > 5)) {
        res.status(400).json({
          success: false,
          message: 'Severity must be between 1 and 5'
        });
        return;
      }

      const issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'> = {
        title,
        description,
        source,
        source_id,
        severity: severity || 1,
        frequency: frequency || 1,
        status: status || 'open',
        tags: tags || [],
        type: type || 'bug',
        jira_exists: typeof jira_exists === 'boolean' ? jira_exists : false
      };

      const newIssue = await IssueModel.create(issueData);
      
      res.status(201).json({
        success: true,
        data: newIssue,
        message: 'Issue created successfully'
      });
    } catch (error) {
      console.error('Error creating issue:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update issue
  static async updateIssue(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid issue ID'
        });
        return;
      }

      const updateData = req.body;
      
      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      const updatedIssue = await IssueModel.update(id, updateData);
      
      if (!updatedIssue) {
        res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedIssue,
        message: 'Issue updated successfully'
      });
    } catch (error) {
      console.error('Error updating issue:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete issue
  static async deleteIssue(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid issue ID'
        });
        return;
      }

      const deleted = await IssueModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Issue deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting issue:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get top issues
  static async getTopIssues(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const issues = await IssueModel.getTopIssues(limit);
      
      res.json({
        success: true,
        data: issues,
        count: issues.length
      });
    } catch (error) {
      console.error('Error fetching top issues:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get issues with analytics
  static async getIssuesWithAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const issues = await IssueModel.getIssuesWithAnalytics(limit);
      
      res.json({
        success: true,
        data: issues,
        count: issues.length
      });
    } catch (error) {
      console.error('Error fetching issues with analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 