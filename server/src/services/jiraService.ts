import { Issue } from '../models/Issue';

// Mock Jira API response interface
interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
    };
    issuetype: {
      name: string;
    };
  };
}

export class JiraService {
  // Mock Jira API configuration
  private static jiraConfig = {
    baseUrl: process.env.JIRA_BASE_URL || 'https://your-domain.atlassian.net',
    email: process.env.JIRA_EMAIL || 'your-email@example.com',
    apiToken: process.env.JIRA_API_TOKEN || 'your-api-token',
    projectKey: process.env.JIRA_PROJECT_KEY || 'PROJ'
  };

  // AI-powered issue matching
  static async findMatchingJiraIssue(issue: Issue): Promise<{ exists: boolean; issueKey?: string; status?: string }> {
    console.log(`🔍 AI analyzing issue "${issue.title}" for Jira match...`);
    
    // TODO: Implement actual AI matching logic
    // This would typically:
    // 1. Use AI to analyze issue title and description
    // 2. Search Jira for similar issues using JQL
    // 3. Use semantic similarity to find matches
    // 4. Return the best match if similarity score > threshold
    
    // For now, use mock logic based on issue title patterns
    const mockMatches: Record<string, { key: string; status: string }> = {
      'App crashes on iOS 17': { key: 'PROJ-123', status: 'In Progress' },
      'Payment processing errors': { key: 'PROJ-456', status: 'To Do' },
      'Login button not working': { key: 'PROJ-789', status: 'Done' },
      'Database connection timeout': { key: 'PROJ-101', status: 'In Progress' },
      'Dark mode support requested': { key: 'PROJ-202', status: 'Backlog' },
      'Mobile app push notifications': { key: 'PROJ-303', status: 'To Do' },
      'Integration with CRM systems': { key: 'PROJ-404', status: 'Backlog' },
      'Advanced search filters': { key: 'PROJ-505', status: 'To Do' }
    };

    const match = mockMatches[issue.title];
    
    if (match) {
      console.log(`✅ Found Jira match: ${match.key} (${match.status})`);
      return {
        exists: true,
        issueKey: match.key,
        status: match.status
      };
    } else {
      console.log(`❌ No Jira match found for "${issue.title}"`);
      return {
        exists: false
      };
    }
  }

  // Fetch Jira issue status
  static async getJiraIssueStatus(issueKey: string): Promise<string | null> {
    try {
      // TODO: Implement actual Jira API call
      // const response = await fetch(`${this.jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}`, {
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(`${this.jiraConfig.email}:${this.jiraConfig.apiToken}`).toString('base64')}`,
      //     'Accept': 'application/json'
      //   }
      // });
      // const data: JiraIssue = await response.json();
      // return data.fields.status.name;

      // Mock response for now
      const mockStatuses: Record<string, string> = {
        'PROJ-123': 'In Progress',
        'PROJ-456': 'To Do',
        'PROJ-789': 'Done',
        'PROJ-101': 'In Progress',
        'PROJ-202': 'Backlog',
        'PROJ-303': 'To Do',
        'PROJ-404': 'Backlog',
        'PROJ-505': 'To Do'
      };

      return mockStatuses[issueKey] || 'Unknown';
    } catch (error) {
      console.error(`Error fetching Jira status for ${issueKey}:`, error);
      return null;
    }
  }

  // Batch process issues to find Jira matches
  static async processIssuesForJiraMatches(issues: Issue[]): Promise<void> {
    console.log(`🔄 Processing ${issues.length} issues for Jira matches...`);
    
    for (const issue of issues) {
      try {
        const match = await this.findMatchingJiraIssue(issue);
        
        if (match.exists && match.issueKey) {
          // Update issue with Jira information
          await this.updateIssueJiraInfo(issue.id!, {
            jira_exists: true,
            jira_issue_key: match.issueKey,
            jira_status: match.status || 'Unknown'
          });
        } else {
          // Mark as not found in Jira
          await this.updateIssueJiraInfo(issue.id!, {
            jira_exists: false,
            jira_issue_key: undefined,
            jira_status: undefined
          });
        }
      } catch (error) {
        console.error(`Error processing issue ${issue.id} for Jira match:`, error);
      }
    }
    
    console.log('✅ Finished processing issues for Jira matches');
  }

  // Process all existing issues for Jira matches
  static async processAllExistingIssues(): Promise<void> {
    console.log('🔄 Processing all existing issues for Jira matches...');
    
    const { IssueModel } = await import('../models/Issue');
    const allIssues = await IssueModel.findAll({ limit: 1000 }); // Get all issues
    
    await this.processIssuesForJiraMatches(allIssues);
  }

  // Update issue with Jira information
  private static async updateIssueJiraInfo(issueId: number, jiraInfo: {
    jira_exists: boolean;
    jira_issue_key?: string | undefined;
    jira_status?: string | undefined;
  }): Promise<void> {
    const { IssueModel } = await import('../models/Issue');
    
    await IssueModel.update(issueId, {
      jira_exists: jiraInfo.jira_exists,
      jira_issue_key: jiraInfo.jira_issue_key,
      jira_status: jiraInfo.jira_status
    });
  }
} 