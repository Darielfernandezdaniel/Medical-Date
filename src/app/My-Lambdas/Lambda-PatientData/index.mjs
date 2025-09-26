import { readFileSync } from 'fs';
import pkg from 'pg';
const { Client } = pkg;

export const handler = async (event) => {
  let client;

  try {
    // Conexión a la DB
    client = new Client({
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

    await client.connect();

    if (event.requestContext.http.method === 'POST') {
      const { patientId, tipoPago } = JSON.parse(event.body);

      // Solo procesar pagos de tipo "cita_medica"
      if (tipoPago !== 'cita_medica') {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Solo se permiten pagos de citas médicas' })
        };
      }

      // Verificar si el paciente tiene seguro
      const res = await client.query(
        'SELECT seguro FROM patients WHERE id = $1',
        [patientId]
      );

      if (res.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Paciente no encontrado' })
        };
      }

      const seguro = res.rows[0].seguro;

      if (seguro && seguro.trim() !== '') {
        // El paciente tiene seguro, no procesar pago
        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: `Paciente ya tiene seguro: ${seguro}` })
        };
      }

      // Si no tiene seguro, continuar con el pago
      // Aquí iría la lógica para crear PaymentIntent o procesar el pago
      // Por ahora devolvemos un mensaje de prueba
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Paciente sin seguro, listo para procesar pago' })
      };
    }

    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Método no permitido' })
    };

  } catch (error) {
    console.error('Error:', error);
    if (client) await client.query('ROLLBACK');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Error interno del servidor', details: error.message })
    };
  } finally {
    if (client) await client.end();
  }
};
