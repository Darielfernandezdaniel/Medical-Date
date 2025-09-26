import { Pool } from 'pg';
import Stripe from 'stripe';
import { readFileSync } from 'fs';

console.log('🚀 Iniciando función Lambda');

let pool;
let stripe;

try {
  console.log('🔗 Inicializando conexión a base de datos...');
  pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true,
      ca: readFileSync('/opt/lambda-layer/nodejs/eu-central-1-bundle.pem').toString(),
    },
  });
  console.log('✅ Pool de base de datos creado');

  console.log('💳 Inicializando Stripe...');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
  console.log('✅ Stripe inicializado');
} catch (initError) {
  console.error('❌ Error en la inicialización:', initError);
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function handler(event) {
  console.log('📨 Evento recibido:', JSON.stringify(event, null, 2));
  console.log('🔄 Iniciando procesamiento del handler...');

  try {
    console.log('🔍 Verificando método HTTP...');
    if (event.httpMethod === 'OPTIONS') {
      console.log('✅ Método OPTIONS detectado, retornando CORS');
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS preflight ok' }) };
    }
    console.log('📝 Método HTTP:', event.httpMethod);

    console.log('🔍 Verificando body del evento...');
    if (!event.body) {
      console.log('❌ Body faltante, retornando error 400');
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'body requerido' }) };
    }
    console.log('📦 Body presente:', event.body);

    console.log('🔄 Parseando JSON del body...');
    // Solo cambiamos los nombres de las variables
    const { email, items } = JSON.parse(event.body);
    console.log('📋 Datos parseados - email:', email, 'items:', items);

    console.log('🔍 Validando email e items...');
    if (!email || !items) {
      console.log('❌ Email o items faltantes, retornando error 400');
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'email e items son requeridos' }) };
    }
    console.log('✅ Email e items válidos');

    console.log('🔄 Obteniendo conexión a base de datos...');
    const client = await pool.connect();
    console.log('✅ Conexión a base de datos obtenida');
    
    try {
      console.log('🔍 Consultando usuario en base de datos...');
      console.log('📧 Query: SELECT seguro FROM patients WHERE email = $1 LIMIT 1 con email:', email);
      const userRes = await client.query(
        'SELECT seguro FROM patients WHERE email = $1 LIMIT 1',
        [email]
      );
      console.log('📊 Resultado query usuario:', userRes.rowCount, 'filas encontradas');
      console.log('📄 Datos usuario:', userRes.rows);
      
      const user = userRes.rows[0];
      console.log('👤 Usuario procesado:', user);

      console.log('🔍 Verificando si usuario ya tiene seguro...');
      if (user?.seguro === items) {
        console.log('✅ Usuario ya tiene el seguro solicitado, retornando respuesta');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'usuario ya tiene seguro', seguro: user.seguro }),
        };
      }
      console.log('📝 Usuario no tiene este seguro o no existe');

      console.log('🔍 Consultando información del seguro...');
      console.log('📋 Query: SELECT nombre, price FROM seguros WHERE nombre = $1 LIMIT 1 con items:', items);
      const seguroRes = await client.query(
        'SELECT nombre, price FROM seguros WHERE nombre = $1 LIMIT 1',
        [items]
      );
      console.log('📊 Resultado query seguro:', seguroRes.rowCount, 'filas encontradas');
      console.log('📄 Datos seguro:', seguroRes.rows);

      if (seguroRes.rowCount === 0) {
        console.log('❌ Seguro no encontrado, retornando error 400');
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'items inválido' }) };
      }

      const selectedSeguro = seguroRes.rows[0];
      console.log('🏥 Seguro seleccionado:', selectedSeguro);
      
      const precioUSD = Number(selectedSeguro.price); 
      const unitAmount = Math.round(precioUSD * 100); 
      console.log('💰 Precio en USD:', precioUSD, 'Unit amount (centavos):', unitAmount);

      console.log('💳 Creando sesión de Stripe...');
      console.log('🔧 Datos para Stripe session:', {
        email: email,
        product_name: selectedSeguro.nombre,
        unit_amount: unitAmount,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL || process.env.STRIPE_SUCCESS_URL
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: selectedSeguro.nombre,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        customer_email: email,
        success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metadata: {
          product_key: 'insurance',
          user_email: email,
          seguro_nombre: selectedSeguro.nombre
        }
      });
      console.log('📦 Metadata enviada a Stripe:', session.metadata);
      console.log('✅ Sesión de Stripe creada exitosamente:', {
        sessionId: session.id,
        url: session.url
      });

      console.log('📤 Preparando respuesta final...');
      const responseBody = {
        message: 'checkout session creada',
        sessionId: session.id,
        url: session.url,
        seguro: selectedSeguro,
      };
      console.log('📋 Respuesta que se enviará:', responseBody);

      console.log('🎯 Retornando respuesta exitosa...');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseBody),
      };
      
    } finally {
      console.log('🧹 Liberando conexión a base de datos...');
      client.release();
      console.log('✅ Conexión liberada');
    }

  } catch (err) {
    console.error('💥 ERROR CAPTURADO:', err);
    console.error('📊 Tipo de error:', typeof err);
    console.error('📝 Stack trace:', err.stack);
    console.error('🔍 Propiedades del error:', Object.keys(err));
    
    console.log('📤 Retornando respuesta de error...');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'error interno del servidor' }) };
  }
}