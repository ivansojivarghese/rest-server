
/*
export const config = {
  runtime: 'nodejs',
};

import { neon } from '@neondatabase/serverless';

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, version, batch } = req.body || {};

  if (!Array.isArray(batch) || batch.length === 0) {
    return res.status(400).json({ error: 'Invalid telemetry batch' });
  }

  try {
    await sql`
      INSERT INTO telemetry (
        user_id,
        session_id,
        success,
        time_to_play,
        data
      )
      SELECT
        ${user ?? 'anonymous'},
        e->>'sessionId',
        (e->>'success')::boolean,
        (e->>'timeToPlay')::int,
        e
      FROM jsonb_array_elements(${JSON.stringify(batch)}::jsonb) AS e
    `;

    return res.status(200).json({
      status: 'ok',
      received: batch.length
    });

  } catch (error) {
    console.error('Telemetry insert failed:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}
*/

export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    method: req.method,
    body: req.body ?? null,
    envExists: !!process.env.DATABASE_URL
  });
}
