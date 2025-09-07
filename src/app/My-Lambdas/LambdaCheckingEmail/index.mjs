import pg from 'pg';
import { readFileSync } from 'fs';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync('/opt/lambda-layer/nodejs/eu-central-1-bundle.pem').toString()
  }
});

export const handler = async (event) => {
  const { email } = JSON.parse(event.body);
  const result = await pool.query('SELECT 1 FROM patients WHERE email_id = $1 LIMIT 1', [email]);
  return {
    statusCode: 200,
    body: JSON.stringify({ exists: result.rowCount > 0 }),
    headers: { "Access-Control-Allow-Origin": "*" }
  };
};