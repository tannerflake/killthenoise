import pool from '../db';

// TypeScript interfaces
export interface Issue {
  id?: number;
  title: string;
  description?: string;
  source: string;
  source_id?: string;
  severity: number;
  frequency: number;
  status: string;
  type: 'bug' | 'feature';
  tags?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface IssueAnalytics {
  id?: number;
  issue_id: number;
  ai_score?: number;
  sentiment_score?: number;
  priority_score?: number;
  analysis_data?: any;
  analyzed_at?: Date;
}

// Issue Model Class
export class IssueModel {
  // Get all issues with optional filtering
  static async findAll(filters?: {
    source?: string;
    status?: string;
    severity?: number;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<Issue[]> {
    let query = 'SELECT * FROM issues';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters) {
      const conditions: string[] = [];
      
      if (filters.source) {
        conditions.push(`source = $${paramIndex++}`);
        params.push(filters.source);
      }
      
      if (filters.status) {
        conditions.push(`status = $${paramIndex++}`);
        params.push(filters.status);
      }
      
      if (filters.severity) {
        conditions.push(`severity = $${paramIndex++}`);
        params.push(filters.severity);
      }
      
      if (filters.type) {
        conditions.push(`type = $${paramIndex++}`);
        params.push(filters.type);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }

    query += ' ORDER BY created_at DESC';
    
    if (filters?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
    }
    
    if (filters?.offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Get issue by ID
  static async findById(id: number): Promise<Issue | null> {
    const result = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Create new issue
  static async create(issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>): Promise<Issue> {
    const query = `
      INSERT INTO issues (title, description, source, source_id, severity, frequency, status, type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      issueData.title,
      issueData.description,
      issueData.source,
      issueData.source_id,
      issueData.severity,
      issueData.frequency,
      issueData.status,
      issueData.type,
      issueData.tags
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update issue
  static async update(id: number, updateData: Partial<Issue>): Promise<Issue | null> {
    const fields = Object.keys(updateData).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    if (fields.length === 0) return null;

    const query = `
      UPDATE issues 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const values = [id, ...fields.map(field => (updateData as any)[field])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete issue
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM issues WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Get top issues by frequency and severity
  static async getTopIssues(limit: number = 10): Promise<Issue[]> {
    const query = `
      SELECT * FROM issues 
      ORDER BY (frequency * severity) DESC, created_at DESC 
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  // Get issues with analytics
  static async getIssuesWithAnalytics(limit: number = 10): Promise<any[]> {
    const query = `
      SELECT 
        i.*,
        ia.ai_score,
        ia.sentiment_score,
        ia.priority_score,
        ia.analysis_data
      FROM issues i
      LEFT JOIN issue_analytics ia ON i.id = ia.issue_id
      ORDER BY (i.frequency * i.severity) DESC, i.created_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
} 