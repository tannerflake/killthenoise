import pool from '../db';

export interface HubSpotToken {
  id?: number;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class HubSpotTokenModel {
  static async create(tokenData: Omit<HubSpotToken, 'id' | 'created_at' | 'updated_at'>): Promise<HubSpotToken> {
    const query = `
      INSERT INTO hubspot_tokens (access_token, refresh_token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [tokenData.access_token, tokenData.refresh_token, tokenData.expires_at];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getLatest(): Promise<HubSpotToken | null> {
    const result = await pool.query('SELECT * FROM hubspot_tokens ORDER BY created_at DESC LIMIT 1');
    return result.rows[0] || null;
  }

  static async update(id: number, updateData: Partial<HubSpotToken>): Promise<HubSpotToken | null> {
    const fields = Object.keys(updateData).filter(key => key !== 'id');
    if (fields.length === 0) return null;

    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(', ');
    const query = `
      UPDATE hubspot_tokens
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, ...fields.map(field => (updateData as any)[field])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async hasValidToken(): Promise<boolean> {
    const result = await pool.query('SELECT 1 FROM hubspot_tokens WHERE expires_at > NOW() ORDER BY expires_at DESC LIMIT 1');
    return (result.rowCount || 0) > 0;
  }
} 