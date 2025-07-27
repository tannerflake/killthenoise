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
    type: 'bug' as 'bug',
    tags: ['ios', 'crash', 'urgent', 'mobile'],
    jira_exists: false
  },
  {
    title: 'Login button not working',
    description: 'Users cannot log in through the main login button on the homepage',
    source: 'slack',
    source_id: 'slack_2',
    severity: 3,
    frequency: 8,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['login', 'authentication', 'frontend'],
    jira_exists: false
  },
  {
    title: 'Add dark mode support',
    description: 'Users are requesting a dark mode option for better night-time usability.',
    source: 'google_docs',
    source_id: 'gdocs_3',
    severity: 2,
    frequency: 9,
    status: 'open',
    type: 'feature' as 'feature',
    tags: ['feature', 'ui', 'user-request'],
    jira_exists: false
  },
  {
    title: 'Payment processing errors',
    description: 'Customers experiencing payment failures during checkout process',
    source: 'hubspot',
    source_id: 'hubspot_1',
    severity: 5,
    frequency: 25,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['payment', 'checkout', 'critical', 'revenue'],
    jira_exists: false
  },
  {
    title: 'Database connection timeout',
    description: 'Database queries timing out under high load conditions',
    source: 'jira',
    source_id: 'jira_1',
    severity: 4,
    frequency: 12,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['database', 'performance', 'backend', 'scalability'],
    jira_exists: false
  },
  {
    title: 'User interface confusion',
    description: 'Feedback about confusing navigation and unclear UI elements',
    source: 'google_docs',
    source_id: 'gdocs_1',
    severity: 2,
    frequency: 5,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['ui', 'ux', 'feedback', 'design'],
    jira_exists: false
  },
  {
    title: 'Implement multi-language support',
    description: 'Feature request to support multiple languages for international users.',
    source: 'hubspot',
    source_id: 'hubspot_3',
    severity: 2,
    frequency: 6,
    status: 'open',
    type: 'feature' as 'feature',
    tags: ['feature', 'i18n', 'user-request'],
    jira_exists: false
  },
  {
    title: 'Email notifications not sending',
    description: 'Users not receiving email notifications for important updates',
    source: 'slack',
    source_id: 'slack_3',
    severity: 3,
    frequency: 10,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['email', 'notifications', 'communication'],
    jira_exists: false
  },
  {
    title: 'Search functionality broken',
    description: 'Search results not displaying correctly or returning no results',
    source: 'hubspot',
    source_id: 'hubspot_2',
    severity: 3,
    frequency: 7,
    status: 'open',
    type: 'bug' as 'bug',
    tags: ['search', 'functionality', 'user-experience'],
    jira_exists: false
  },
  {
    title: 'Add export to CSV option',
    description: 'Users want to export their data to CSV for offline analysis.',
    source: 'slack',
    source_id: 'slack_5',
    severity: 1,
    frequency: 4,
    status: 'open',
    type: 'feature' as 'feature',
    tags: ['feature', 'data-export', 'user-request'],
    jira_exists: false
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