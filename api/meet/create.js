// Vercel serverless function: create a Google Meet meeting for an in-app call.
// Uses the Google Calendar API (events.insert + conferenceData) — the only
// Meet-creation path available to a personal Gmail account (the Meet
// spaces.create API requires a Google Workspace account).
//
// Required environment variables (set on Vercel, never in the frontend):
//   GOOGLE_CLIENT_ID       OAuth 2.0 web-app client ID
//   GOOGLE_CLIENT_SECRET   OAuth 2.0 web-app client secret
//   GOOGLE_REFRESH_TOKEN   long-lived refresh token for the Google account
// Scope required: https://www.googleapis.com/auth/calendar.events
//
// POST /api/meet/create
//   body: { peerName?: string, callType?: 'audio' | 'video' }
//   -> { ok: true, meetUrl, meetCode, eventId, summary }
// On missing credentials / Google error -> { ok: false, error }

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

let cachedToken = null;       // { accessToken, expiresAt }
let tokenInFlight = null;     // de-dup concurrent refreshes

function getCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken() {
  // Reuse a still-valid token.
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }
  // Coalesce concurrent refreshes.
  if (tokenInFlight) return tokenInFlight;

  const creds = getCredentials();
  if (!creds) {
    throw new Error(
      'Google Meet integration is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN on Vercel.'
    );
  }

  tokenInFlight = (async () => {
    const body = new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: 'refresh_token',
    });
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Google token refresh failed (${res.status}): ${detail}`);
    }
    const tok = await res.json();
    cachedToken = {
      accessToken: tok.access_token,
      expiresAt: Date.now() + (tok.expires_in || 3600) * 1000,
    };
    return cachedToken.accessToken;
  })();

  try {
    return await tokenInFlight;
  } finally {
    tokenInFlight = null;
  }
}

function randomRequestId() {
  return 'valence-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default async function handler(req, res) {
  // Only allow POST.
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    let peerName = '';
    let callType = 'audio';
    try {
      const body = await req.json().catch(() => ({}));
      peerName = (body.peerName || '').toString().slice(0, 120);
      callType = body.callType === 'video' ? 'video' : 'audio';
    } catch (_) { /* empty body is fine */ }

    const accessToken = await getAccessToken();

    // Create an instant calendar event with a Google Meet conference attached.
    // conferenceType 'eventHangout' provisions a Meet room; the response's
    // hangoutLink is the external Meet URL both call participants can open.
    const payload = {
      summary: `VALENCE Academy call${peerName ? ' — ' + peerName : ''}`,
      description: `VALENCE Academy ${callType} call. Join via Google Meet.`,
      conferenceData: {
        createRequest: {
          requestId: randomRequestId(),
          conferenceType: 'eventHangout',
        },
      },
    };

    const meetRes = await fetch(`${CALENDAR_URL}?conferenceDataVersion=1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const meetBody = await meetRes.json().catch(() => ({}));
    if (!meetRes.ok) {
      const detail = meetBody?.error?.message || JSON.stringify(meetBody);
      throw new Error(`Google Calendar event creation failed (${meetRes.status}): ${detail}`);
    }

    const meetUrl = meetBody.hangoutLink || meetBody.conferenceData?.uri || null;
    if (!meetUrl) {
      throw new Error('Google Meet link was not returned by the Calendar API.');
    }

    return res.status(200).json({
      ok: true,
      meetUrl,
      meetCode: meetBody.conferenceData?.meetingCode || null,
      eventId: meetBody.id,
      summary: meetBody.summary,
    });
  } catch (err) {
    const message = err?.message || 'Failed to create Google Meet meeting';
    return res.status(502).json({ ok: false, error: message });
  }
}
