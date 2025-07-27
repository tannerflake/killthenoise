import axios from 'axios';
import { HubSpotTokenModel } from '../models/HubSpotToken';
import { IssueModel } from '../models/Issue';

export class HubSpotService {
  static async getAccessToken(): Promise<string> {
    const latest = await HubSpotTokenModel.getLatest();
    if (!latest) throw new Error('No HubSpot token found');

    // Check expiry (buffer 2 minutes)
    const bufferMs = 2 * 60 * 1000;
    if (new Date(latest.expires_at).getTime() - Date.now() > bufferMs) {
      return latest.access_token;
    }

    // Refresh token
    const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        refresh_token: latest.refresh_token,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    await HubSpotTokenModel.update(latest.id!, {
      access_token,
      refresh_token,
      expires_at: expiresAt,
    });
    return access_token;
  }

  static async fetchTickets(): Promise<void> {
    const token = await this.getAccessToken();

    const res = await axios.get('https://api.hubapi.com/crm/v3/objects/tickets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 5,
        properties: 'subject,content,createdate,hs_ticket_priority',
        sorts: '-createdate',
      },
    });

    const tickets = res.data.results || [];

    // Remove existing HubSpot-sourced issues to avoid duplicates/mock data
    await (await import('../db')).default.query('DELETE FROM issues WHERE source = $1', ['hubspot']);

    for (const ticket of tickets) {
      const priority = (ticket.properties.hs_ticket_priority || '').toLowerCase();
      let severity = 2;
      if (priority === 'high') severity = 5;
      else if (priority === 'medium') severity = 3;
      else if (priority === 'low') severity = 1;

      const issueData = {
        title: ticket.properties.subject || 'Ticket',
        description: ticket.properties.content || '',
        source: 'hubspot',
        source_id: ticket.id,
        severity,
        frequency: 1,
        status: 'open',
        type: 'bug' as 'bug',
        tags: ['hubspot'],
        jira_exists: false,
        created_at: new Date(ticket.properties.createdate || Date.now()),
      } as const;

      await IssueModel.create(issueData as any);
    }
  }
} 