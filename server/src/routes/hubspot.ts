import express from 'express';
import axios from 'axios';
import { HubSpotTokenModel } from '../models/HubSpotToken';

const router = express.Router();

// GET /api/hubspot/callback
router.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({ success: false, message: 'Missing code in query params' });
    return;
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
        code,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    console.log('HubSpot access token:', access_token);

    // Persist tokens
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    await HubSpotTokenModel.create({
      access_token,
      refresh_token,
      expires_at: expiresAt,
    });

    res.json({ success: true, message: 'HubSpot access token received', access_token });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ success: false, message: 'Failed to exchange code for token' });
  }
});

// GET /api/hubspot/status
router.get('/status', async (_req, res) => {
  try {
    const connected = await HubSpotTokenModel.hasValidToken();
    res.json({ connected });
  } catch (error) {
    console.error('Error checking HubSpot status:', error);
    res.status(500).json({ connected: false });
  }
});

// POST /api/hubspot/sync
router.post('/sync', async (_req, res) => {
  try {
    const { HubSpotService } = await import('../services/hubspotService');
    await HubSpotService.fetchTickets();
    res.json({ success: true, message: 'HubSpot tickets synced' });
  } catch (error) {
    console.error('Error syncing HubSpot tickets:', error);
    res.status(500).json({ success: false, message: 'Failed to sync tickets' });
  }
});

export default router; 