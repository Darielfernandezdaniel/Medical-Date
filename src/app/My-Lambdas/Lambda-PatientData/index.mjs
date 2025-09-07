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
      // Parseamos el body
      const { name, apellido, sexo, edad, illness, familyIllness, medication, email} = JSON.parse(event.body);

      // INSERT en patients
      const resPatient = await client.query(
        `INSERT INTO patients(nombre, apellido, edad, sexo, email_id) 
         VALUES($1, $2, $3, $4, $5) RETURNING id`,
        [name, apellido, edad, sexo, email]
      );

      const patientId = resPatient.rows[0].id;
      

      // INSERT en illness (columna real: "personal_illnesses")
     
        await client.query(
          `INSERT INTO illness(patient_id, personal_illnesses) VALUES($1, $2)`,
          [patientId, illness]
        );

      // INSERT en family_illness (columna correcta: "family_illness")
    
        await client.query(
          `INSERT INTO family_illness(patient_id, family_illness) VALUES($1, $2)`,
          [patientId, familyIllness]
        );

      // INSERT en permanent_medication (columna correcta: "medications")
    
        await client.query(
          `INSERT INTO permanent_medication(patient_id, medications) VALUES($1, $2)`,
          [patientId, medication]
        );

      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({ 
          message: 'Datos insertados correctamente',
          patientId: patientId 
        })
      };
    }

    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Método no permitido' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  } finally {
    if (client) await client.end();
  }
};