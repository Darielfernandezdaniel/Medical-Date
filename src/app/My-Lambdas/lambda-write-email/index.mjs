// lambda-writeEmail.js
import pkg from 'pg';
import { readFileSync } from 'fs';   // 👈 IMPORT NECESARIO

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,        // Endpoint RDS
  user: process.env.DB_USER,        // Usuario
  password: process.env.DB_PASSWORD, // Contraseña
  database: process.env.DB_NAME,    // Nombre de la base
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync('/opt/lambda-layer/nodejs/eu-central-1-bundle.pem').toString(), // 👈 Lee el CA bundle
  }
});

export const handler = async (event) => {
  const { email } = JSON.parse(event.body || '{}');

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email no proporcionado" }),
    };
  }

  let client;

  try {
    client = await pool.connect();

    // Insertamos el email, evitando duplicados con ON CONFLICT
    const query = `
      INSERT INTO emails (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `;

    const res = await client.query(query, [email]);

    if (res.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email ya existente" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Email registrado correctamente", 
        data: res.rows[0] 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    if (client) client.release();
  }
};
