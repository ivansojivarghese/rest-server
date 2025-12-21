
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
/*
export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`SELECT now() as time`;

    return res.status(200).json({
      db: 'connected',
      time: result[0].time
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
}
*/
/*
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require'
});

export default async function handler(req, res) {
  try {
    const result = await sql`SELECT 1 as ok`;
    return res.status(200).json({ ok: result[0].ok });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
}
*/

import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require'
});

export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user, batch } = req.body || {};

    if (!Array.isArray(batch) || batch.length === 0) {
      return res.status(200).json({ status: 'ok', received: 0 });
    }

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
          ${event.sessionId ?? 'unknown'},
          ${event.success ?? null},
          ${event.timeToPlay ?? null},
          ${sql.json(event)}
        )
      `;
    }

    return res.status(200).json({
      status: 'ok',
      received: batch.length
    });
  } catch (err) {
    console.error('Telemetry insert failed:', err);
    return res.status(500).json({ error: err.message });
  }
}
