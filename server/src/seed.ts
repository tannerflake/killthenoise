import { initializeDatabase } from './db';
import { IssueModel } from './models/Issue';
import dotenv from 'dotenv';

dotenv.config();

const seedData = [
  {
    title: 'App crashes on iOS 17',
    description: 'Multiple users reporting app crashes on iOS 17 devices, particularly when navigating between screens',
    source: 'slack',
    source_id: 'slack_1',
    severity: 4,
    frequency: 15,
    status: 'open',
    tags: ['ios', 'crash', 'urgent', 'mobile']
  },
  {
    title: 'Login button not working',
    description: 'Users cannot log in through the main login button on the homepage',
    source: 'slack',
    source_id: 'slack_2',
    severity: 3,
    frequency: 8,
    status: 'open',
    tags: ['login', 'authentication', 'frontend']
  },
  {
    title: 'Payment processing errors',
    description: 'Customers experiencing payment failures during checkout process',
    source: 'hubspot',
    source_id: 'hubspot_1',
    severity: 5,
    frequency: 25,
    status: 'open',
    tags: ['payment', 'checkout', 'critical', 'revenue']
  },
  {
    title: 'Database connection timeout',
    description: 'Database queries timing out under high load conditions',
    source: 'jira',
    source_id: 'jira_1',
    severity: 4,
    frequency: 12,
    status: 'open',
    tags: ['database', 'performance', 'backend', 'scalability']
  },
  {
    title: 'User interface confusion',
    description: 'Feedback about confusing navigation and unclear UI elements',
    source: 'google_docs',
    source_id: 'gdocs_1',
    severity: 2,
    frequency: 5,
    status: 'open',
    tags: ['ui', 'ux', 'feedback', 'design']
  },
  {
    title: 'Email notifications not sending',
    description: 'Users not receiving email notifications for important updates',
    source: 'slack',
    source_id: 'slack_3',
    severity: 3,
    frequency: 10,
    status: 'open',
    tags: ['email', 'notifications', 'communication']
  },
  {
    title: 'Search functionality broken',
    description: 'Search results not displaying correctly or returning no results',
    source: 'hubspot',
    source_id: 'hubspot_2',
    severity: 3,
    frequency: 7,
    status: 'open',
    tags: ['search', 'functionality', 'user-experience']
  },
  {
    title: 'API rate limiting too aggressive',
    description: 'API calls being rate limited too aggressively, affecting user experience',
    source: 'jira',
    source_id: 'jira_2',
    severity: 3,
    frequency: 6,
    status: 'open',
    tags: ['api', 'rate-limiting', 'performance']
  },
  {
    title: 'Mobile app slow loading',
    description: 'Mobile app taking too long to load initial screens',
    source: 'google_docs',
    source_id: 'gdocs_2',
    severity: 2,
    frequency: 4,
    status: 'open',
    tags: ['mobile', 'performance', 'loading']
  },
  {
    title: 'Data export feature missing',
    description: 'Users requesting ability to export their data in various formats',
    source: 'slack',
    source_id: 'slack_4',
    severity: 2,
    frequency: 3,
    status: 'open',
    tags: ['feature-request', 'data-export', 'user-request']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    const existingIssues = await IssueModel.findAll();
    for (const issue of existingIssues) {
      if (issue.id) {
        await IssueModel.delete(issue.id);
      }
    }
    
    // Insert seed data
    console.log('📝 Inserting seed data...');
    for (const issueData of seedData) {
      await IssueModel.create(issueData);
    }
    
    console.log(`✅ Successfully seeded ${seedData.length} issues`);
    console.log('🎉 Database seeding completed!');
    
    // Display summary
    const allIssues = await IssueModel.findAll();
    console.log(`📊 Total issues in database: ${allIssues.length}`);
    
    const criticalIssues = allIssues.filter(issue => issue.severity >= 4);
    console.log(`🚨 Critical issues (severity >= 4): ${criticalIssues.length}`);
    
    const openIssues = allIssues.filter(issue => issue.status === 'open');
    console.log(`🔓 Open issues: ${openIssues.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 