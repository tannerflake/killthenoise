# Integration Implementation Guide 🔌

This guide shows you exactly where and how to implement real integrations for KillTheNoise.ai.

## 📍 Current Integration Locations

All placeholder integrations are located in: `server/src/services/integrationService.ts`

### 1. Slack Integration (Lines 27-73)

**Current Status**: Mock data only
**File**: `server/src/services/integrationService.ts`
**Method**: `ingestSlackData()`

**To Implement Real Slack Integration**:

1. **Install Slack SDK**:
   ```bash
   cd server
   npm install @slack/web-api
   ```

2. **Add Environment Variables**:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   ```

3. **Replace Mock Method**:
   ```typescript
   import { WebClient } from '@slack/web-api';
   
   static async ingestSlackData(config: IntegrationConfig): Promise<RawIssueData[]> {
     const client = new WebClient(process.env.SLACK_BOT_TOKEN);
     
     try {
       // Get channels from config
       const channels = config.config.channels || [];
       const issues: RawIssueData[] = [];
       
       for (const channelId of channels) {
         // Fetch messages from channel
         const result = await client.conversations.history({
           channel: channelId,
           limit: 100
         });
         
         // Process messages for issues
         for (const message of result.messages || []) {
           // Use AI to analyze message content
           const analysis = await this.analyzeMessageWithAI(message.text || '');
           
           if (analysis.isIssue) {
             issues.push({
               id: `slack_${message.ts}`,
               title: analysis.title,
               description: message.text,
               source: 'slack',
               source_id: channelId,
               severity: analysis.severity,
               frequency: 1,
               tags: analysis.tags,
               metadata: {
                 channel: channelId,
                 user: message.user,
                 timestamp: message.ts
               }
             });
           }
         }
       }
       
       return issues;
     } catch (error) {
       console.error('Slack integration error:', error);
       return [];
     }
   }
   ```

### 2. HubSpot Integration (Lines 75-106)

**Current Status**: Mock data only
**File**: `server/src/services/integrationService.ts`
**Method**: `ingestHubSpotData()`

**To Implement Real HubSpot Integration**:

1. **Install HubSpot SDK**:
   ```bash
   cd server
   npm install @hubspot/api-client
   ```

2. **Add Environment Variables**:
   ```env
   HUBSPOT_API_KEY=your-hubspot-api-key
   HUBSPOT_PORTAL_ID=your-portal-id
   ```

3. **Replace Mock Method**:
   ```typescript
   import { Client } from '@hubspot/api-client';
   
   static async ingestHubSpotData(config: IntegrationConfig): Promise<RawIssueData[]> {
     const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_API_KEY });
     
     try {
       // Get tickets from HubSpot
       const tickets = await hubspotClient.crm.tickets.basicApi.getPage();
       const issues: RawIssueData[] = [];
       
       for (const ticket of tickets.results) {
         // Use AI to analyze ticket content
         const analysis = await this.analyzeTicketWithAI(ticket.properties);
         
         if (analysis.isIssue) {
           issues.push({
             id: `hubspot_${ticket.id}`,
             title: analysis.title,
             description: ticket.properties.content,
             source: 'hubspot',
             source_id: ticket.id,
             severity: analysis.severity,
             frequency: 1,
             tags: analysis.tags,
             metadata: {
               ticket_id: ticket.id,
               status: ticket.properties.hs_ticket_priority,
               customer_tier: ticket.properties.hs_ticket_priority
             }
           });
         }
       }
       
       return issues;
     } catch (error) {
       console.error('HubSpot integration error:', error);
       return [];
     }
   }
   ```

### 3. Jira Integration (Lines 108-139)

**Current Status**: Mock data only
**File**: `server/src/services/integrationService.ts`
**Method**: `ingestJiraData()`

**To Implement Real Jira Integration**:

1. **Install Jira SDK**:
   ```bash
   cd server
   npm install jira-client
   ```

2. **Add Environment Variables**:
   ```env
   JIRA_HOST=your-domain.atlassian.net
   JIRA_USERNAME=your-email@domain.com
   JIRA_API_TOKEN=your-api-token
   ```

3. **Replace Mock Method**:
   ```typescript
   import JiraApi from 'jira-client';
   
   static async ingestJiraData(config: IntegrationConfig): Promise<RawIssueData[]> {
     const jira = new JiraApi({
       protocol: 'https',
       host: process.env.JIRA_HOST,
       username: process.env.JIRA_USERNAME,
       password: process.env.JIRA_API_TOKEN,
       apiVersion: '2',
       strictSSL: true
     });
     
     try {
       const projects = config.config.projects || [];
       const issues: RawIssueData[] = [];
       
       for (const projectKey of projects) {
         // Get issues from Jira project
         const jiraIssues = await jira.searchJira(
           `project = ${projectKey} AND type IN (Bug, Issue)`,
           { maxResults: 100 }
         );
         
         for (const issue of jiraIssues.issues) {
           const analysis = await this.analyzeJiraIssueWithAI(issue);
           
           if (analysis.isIssue) {
             issues.push({
               id: `jira_${issue.key}`,
               title: analysis.title,
               description: issue.fields.description,
               source: 'jira',
               source_id: issue.key,
               severity: analysis.severity,
               frequency: 1,
               tags: analysis.tags,
               metadata: {
                 issue_key: issue.key,
                 assignee: issue.fields.assignee?.displayName,
                 priority: issue.fields.priority?.name,
                 status: issue.fields.status?.name
               }
             });
           }
         }
       }
       
       return issues;
     } catch (error) {
       console.error('Jira integration error:', error);
       return [];
     }
   }
   ```

### 4. Google Docs Integration (Lines 141-172)

**Current Status**: Mock data only
**File**: `server/src/services/integrationService.ts`
**Method**: `ingestGoogleDocsData()`

**To Implement Real Google Docs Integration**:

1. **Install Google APIs**:
   ```bash
   cd server
   npm install googleapis
   ```

2. **Add Environment Variables**:
   ```env
   GOOGLE_DOCS_API_KEY=your-api-key
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **Replace Mock Method**:
   ```typescript
   import { google } from 'googleapis';
   
   static async ingestGoogleDocsData(config: IntegrationConfig): Promise<RawIssueData[]> {
     const auth = new google.auth.GoogleAuth({
       credentials: {
         client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
       },
       scopes: ['https://www.googleapis.com/auth/documents.readonly']
     });
     
     const docs = google.docs({ version: 'v1', auth });
     const drive = google.drive({ version: 'v3', auth });
     
     try {
       const folderIds = config.config.folder_ids || [];
       const issues: RawIssueData[] = [];
       
       for (const folderId of folderIds) {
         // Get documents from Google Drive folder
         const files = await drive.files.list({
           q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
           fields: 'files(id, name)'
         });
         
         for (const file of files.data.files || []) {
           // Get document content
           const document = await docs.documents.get({
             documentId: file.id!
           });
           
           const content = document.data.body?.content?.map(item => 
             item.paragraph?.elements?.map(element => element.textRun?.content).join('')
           ).join('') || '';
           
           // Use AI to analyze document content
           const analysis = await this.analyzeDocumentWithAI(content);
           
           if (analysis.isIssue) {
             issues.push({
               id: `gdocs_${file.id}`,
               title: analysis.title,
               description: content.substring(0, 500) + '...',
               source: 'google_docs',
               source_id: file.id!,
               severity: analysis.severity,
               frequency: 1,
               tags: analysis.tags,
               metadata: {
                 document_id: file.id,
                 document_title: file.name,
                 folder_id: folderId
               }
             });
           }
         }
       }
       
       return issues;
     } catch (error) {
       console.error('Google Docs integration error:', error);
       return [];
     }
   }
   ```

## 🤖 AI Analysis Methods

You'll need to implement these AI analysis methods:

```typescript
// Add to integrationService.ts
static async analyzeMessageWithAI(content: string) {
  // TODO: Implement OpenAI analysis
  return {
    isIssue: true,
    title: 'Extracted issue title',
    severity: 3,
    tags: ['tag1', 'tag2']
  };
}

static async analyzeTicketWithAI(ticketData: any) {
  // TODO: Implement OpenAI analysis
  return {
    isIssue: true,
    title: 'Extracted issue title',
    severity: 3,
    tags: ['tag1', 'tag2']
  };
}

static async analyzeJiraIssueWithAI(issue: any) {
  // TODO: Implement OpenAI analysis
  return {
    isIssue: true,
    title: 'Extracted issue title',
    severity: 3,
    tags: ['tag1', 'tag2']
  };
}

static async analyzeDocumentWithAI(content: string) {
  // TODO: Implement OpenAI analysis
  return {
    isIssue: true,
    title: 'Extracted issue title',
    severity: 3,
    tags: ['tag1', 'tag2']
  };
}
```

## 🔄 Scheduling Integrations

Add a cron job or scheduler to run integrations automatically:

```typescript
// Add to server/src/index.ts
import cron from 'node-cron';

// Run integrations every hour
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Running scheduled integrations...');
  await IntegrationService.runAllIntegrations();
});
```

## 🧪 Testing Integrations

1. **Test Individual Integrations**:
   ```bash
   # Test Slack
   curl -X POST http://localhost:5000/api/integrations/test
   ```

2. **Check Database**:
   ```bash
   # View seeded data
   curl http://localhost:5000/api/issues
   ```

3. **Monitor Logs**:
   ```bash
   # Watch server logs
   npm run server
   ```

## 📊 Integration Status Dashboard

The dashboard already shows integration status. Update the `IntegrationStatus` component to show real status:

```typescript
// In client/src/components/IntegrationStatus.tsx
const [integrations, setIntegrations] = useState([]);

useEffect(() => {
  // Fetch real integration status from API
  fetchIntegrationStatus();
}, []);
```

## 🚀 Next Steps

1. **Choose Your First Integration**: Start with Slack or HubSpot
2. **Set Up API Keys**: Get credentials from each platform
3. **Implement One Integration**: Replace mock data with real API calls
4. **Test Thoroughly**: Ensure data is being ingested correctly
5. **Add AI Analysis**: Implement OpenAI integration for issue detection
6. **Scale Up**: Add remaining integrations one by one

## 📚 Resources

- [Slack API Documentation](https://api.slack.com/)
- [HubSpot API Documentation](https://developers.hubspot.com/)
- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Google Docs API](https://developers.google.com/docs/api)
- [OpenAI API](https://platform.openai.com/docs/api-reference)

---

**Remember**: Start with one integration and get it working perfectly before moving to the next one! 