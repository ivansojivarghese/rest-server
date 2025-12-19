import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, version, batch } = req.body || {};

  // Basic validation
  if (!Array.isArray(batch) || batch.length === 0) {
    return res.status(400).json({ error: 'Invalid telemetry batch' });
  }

  try {
    // Insert each telemetry event
    for (const event of batch) {
      await sql`
        INSERT INTO telemetry (
          user_id,
          session_id,
          success,
          time_to_play,
          data
        )
        VALUES (
          ${user ?? 'anonymous'},
          ${event.sessionId},
          ${event.success},
          ${event.timeToPlay},
          ${JSON.stringify(event)}
        )
      `;
    }

    return res.status(200).json({
      status: 'ok',
      received: batch.length
    });

  } catch (error) {
    console.error('Telemetry insert failed:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}
