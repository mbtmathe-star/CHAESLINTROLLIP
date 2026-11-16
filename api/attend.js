// Records an attendee check-in from the live page into Vercel Blob storage.
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const clean = v => String(v || '').trim().slice(0, 120);
  const name = clean(body.name), surname = clean(body.surname), email = clean(body.email).toLowerCase();
  const session = clean(body.session);
  if (!name || !surname || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Name, surname and a valid email are required' });
  }
  const at = new Date();
  const record = {
    name, surname, email, session,
    at: at.toISOString(),
    atSAST: at.toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
    ua: clean(req.headers['user-agent']).slice(0, 200)
  };
  const safeEmail = email.replace(/[^a-z0-9@._-]/g, '_');
  const key = `attendance/${at.toISOString().slice(0, 10)}/${at.getTime()}-${safeEmail}.json`;
  await put(key, JSON.stringify(record), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
  return res.status(200).json({ ok: true });
}
