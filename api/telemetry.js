export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, version, batch } = req.body || {};

  // Basic validation
  if (!Array.isArray(batch) || batch.length === 0) {
    return res.status(400).json({ error: 'Invalid telemetry batch' });
  }

  // Enrich events
  const enrichedEvents = batch.map(event => ({
    ...event,
    user: user ?? 'anonymous',
    version: version ?? '1.0',
    receivedAt: Date.now()
  }));

  // ⚠️ Serverless note:
  // You CANNOT reliably write to local files on Vercel.
  // Use logging, DB, or external storage instead.

  console.log('Telemetry batch received:', enrichedEvents);

  return res.status(200).json({
    status: 'ok',
    received: batch.length
  });
}
