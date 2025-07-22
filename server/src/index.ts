import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import issueRoutes from './routes/issues';
import { IntegrationService } from './services/integrationService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/issues', issueRoutes);

// Integration test endpoint
app.post('/api/integrations/test', async (req, res) => {
  try {
    console.log('🧪 Running integration test...');
    await IntegrationService.runAllIntegrations();
    
    res.json({
      success: true,
      message: 'Integration test completed successfully'
    });
  } catch (error) {
    console.error('Integration test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Integration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Jira matching endpoint
app.post('/api/jira/match-all', async (req, res) => {
  try {
    console.log('🔍 Running Jira matching for all issues...');
    const { JiraService } = await import('./services/jiraService');
    await JiraService.processAllExistingIssues();
    res.json({
      success: true,
      message: 'Jira matching completed successfully'
    });
  } catch (error) {
    console.error('Jira matching failed:', error);
    res.status(500).json({
      success: false,
      message: 'Jira matching failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});



// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting KillTheNoise.ai server...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer(); 