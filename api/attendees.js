// Private attendance list. Open /api/attendees?key=YOUR_KEY (add &csv=1 for a download).
import { list, get } from '@vercel/blob';

export default async function handler(req, res) {
  const key = (req.query && req.query.key) || '';
  if (!process.env.ATTEND_KEY || key !== process.env.ATTEND_KEY) return res.status(401).send('Not authorised');
  const rows = [];
  let cursor;
  do {
    const page = await list({ prefix: 'attendance/', cursor, limit: 1000 });
    for (const b of page.blobs) {
      try {
        const r = await get(b.pathname, { access: 'private' });
        if (r && r.statusCode === 200) rows.push(JSON.parse(await new Response(r.stream).text()));
      } catch {}
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  rows.sort((a, b) => (a.at < b.at ? 1 : -1));
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (req.query.csv) {
    const csv = ['Name,Surname,Email,Session,Time (SAST)'].concat(rows.map(r => [r.name, r.surname, r.email, r.session, r.atSAST].map(v => '"' + String(v || '').replace(/"/g, '""') + '"').join(','))).join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="live-attendance.csv"');
    return res.status(200).send(csv);
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live attendance (${rows.length})</title>
<style>body{font-family:system-ui,sans-serif;background:#0b0b0b;color:#eee;margin:0;padding:24px}h1{font-size:22px;margin:0 0 6px}p{color:#999;margin:0 0 18px}a{color:#d6a93a}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #222}th{color:#d6a93a;font-size:11px;letter-spacing:.1em;text-transform:uppercase}tr:hover td{background:#141414}</style></head><body>
<h1>Live attendance: ${rows.length} check-in${rows.length === 1 ? '' : 's'}</h1><p><a href="?key=${esc(key)}&csv=1">Download CSV</a> · refresh this page for new check-ins</p>
<table><tr><th>#</th><th>Name</th><th>Surname</th><th>Email</th><th>Session</th><th>Checked in (SAST)</th></tr>
${rows.map((r, i) => `<tr><td>${rows.length - i}</td><td>${esc(r.name)}</td><td>${esc(r.surname)}</td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td><td>${esc(r.session)}</td><td>${esc(r.atSAST)}</td></tr>`).join('')}
</table></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(html);
}
