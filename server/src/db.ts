import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'killthenoise',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a new pool instance
const pool = new Pool(dbConfig);

// Test the database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables
export const initializeDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    
    // Create issues table
    await client.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        source VARCHAR(100) NOT NULL,
        source_id VARCHAR(255),
        severity INTEGER DEFAULT 1 CHECK (severity >= 1 AND severity <= 5),
        frequency INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'open',
        type VARCHAR(20) DEFAULT 'bug' CHECK (type IN ('bug', 'feature')),
        tags TEXT[],
        jira_issue_key VARCHAR(50),
        jira_status VARCHAR(50),
        jira_exists BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add type column if it doesn't exist (for existing databases)
    try {
      await client.query(`
        ALTER TABLE issues ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'bug' CHECK (type IN ('bug', 'feature'));
      `);
    } catch (error) {
      // Column might already exist, ignore error
      console.log('Type column already exists or could not be added');
    }

    // Add Jira tracking columns if they don't exist
    try {
      await client.query(`
        ALTER TABLE issues ADD COLUMN IF NOT EXISTS jira_issue_key VARCHAR(50);
        ALTER TABLE issues ADD COLUMN IF NOT EXISTS jira_status VARCHAR(50);
        ALTER TABLE issues ADD COLUMN IF NOT EXISTS jira_exists BOOLEAN DEFAULT false;
      `);
    } catch (error) {
      // Columns might already exist, ignore error
      console.log('Jira tracking columns already exist or could not be added');
    }

    // Create sources table for tracking data sources
    await client.query(`
      CREATE TABLE IF NOT EXISTS data_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL,
        config JSONB,
        is_active BOOLEAN DEFAULT true,
        last_sync TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create issue_analytics table for AI analysis results
    await client.query(`
      CREATE TABLE IF NOT EXISTS issue_analytics (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
        ai_score DECIMAL(3,2),
        sentiment_score DECIMAL(3,2),
        priority_score DECIMAL(3,2),
        analysis_data JSONB,
        analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create hubspot_tokens table for storing HubSpot OAuth tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS hubspot_tokens (
        id SERIAL PRIMARY KEY,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully');
    client.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool; 