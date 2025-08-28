import pkg from 'pg';
const { Client } = pkg;

export const handler = async (event) => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432
  });

  await client.connect();

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const { name, apellido, edad, sexo } = body;

    const result = await client.query(
      'INSERT INTO personas(name, apellido, edad, sexo) VALUES($1, $2, $3, $4) RETURNING *',
      [name, apellido, edad, sexo]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  }

  await client.end();
  return { statusCode: 400, body: 'Bad request' };
};