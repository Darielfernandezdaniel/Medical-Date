import Stripe from 'stripe';
import { Buffer } from 'buffer';
import { readFileSync } from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cliente global
let client;

const getClient = async () => {
  if (!client) {
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
  }
  return client;
};

// CORS HEADERS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,stripe-signature',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

export const handler = async (event) => {
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;

  // MANEJAR OPTIONS REQUEST
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  try {
    const client = await getClient();

    // GET: consulta de estado
    if (httpMethod === 'GET') {
      const paymentIntentId = event.queryStringParameters?.paymentIntentId;
      if (!paymentIntentId) return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ error: 'paymentIntentId requerido' }) 
      };

      let actualPaymentIntentId = paymentIntentId;

      // Si es Session ID, convertir a Payment Intent ID
      if (paymentIntentId.startsWith('cs_')) {
        try {
          console.log(`🔄 Convirtiendo Session ID: ${paymentIntentId}`);
          const session = await stripe.checkout.sessions.retrieve(paymentIntentId);

          if (!session.payment_intent) {
            return { 
              statusCode: 404, 
              headers: corsHeaders,
              body: JSON.stringify({ error: 'Payment Intent no encontrado en la sesión' }) 
            };
          }

          actualPaymentIntentId = session.payment_intent;
          console.log(`✅ Payment Intent obtenido: ${actualPaymentIntentId}`);

        } catch (error) {
          console.error('❌ Error obteniendo Payment Intent:', error);
          return { 
            statusCode: 400, 
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Error al obtener Payment Intent desde Session ID' }) 
          };
        }
      }

      const result = await client.query(
        'SELECT status FROM payments WHERE payment_intent_id = $1',
        [actualPaymentIntentId]
      );

      if (result.rows.length === 0) return { 
        statusCode: 200, 
        headers: corsHeaders,
        body: JSON.stringify({ success: null, status: 'not_found' }) 
      };

      const dbStatus = result.rows[0].status;
      const success = dbStatus === 'succeeded' || dbStatus === 'complete';
      return { 
        statusCode: 200, 
        headers: corsHeaders,
        body: JSON.stringify({ success, status: dbStatus }) 
      };
    }

    // POST: webhook de Stripe
    if (httpMethod === 'POST') {
      console.log('🔥 WEBHOOK POST RECIBIDO');
      
      const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body;
      const sigHeader = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];

      const stripeEvent = stripe.webhooks.constructEvent(rawBody, sigHeader, process.env.STRIPE_ENDPOINT_SECRET);
      console.log('📡 Stripe Event Type:', stripeEvent.type);
      
      const session = stripeEvent.data.object;
      const status = session.status;
      let success = status === 'succeeded' || status === 'complete';
      const productKey = session.metadata?.product_key;
      console.log(`📡 Stripe Event Type: ${stripeEvent.type} | 🔑 Product Key: ${productKey} | status: ${status} | success: ${success} | sessionId: ${session.id} | amount: ${session.amount || session.amount_total}`);
      const customerName = session.metadata?.customer_name || null;
      if (stripeEvent.type === 'checkout.session.completed') {
        
        // REGISTRAR TODOS LOS PAGOS (test, insurance, etc.)
        console.log('💾 Registrando pago en base de datos...');
        await client.query(
          `INSERT INTO payments (payment_intent_id, user_id, amount, currency, status, stripe_created_at, patient_full_name)
           VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6), $7)
           ON CONFLICT (payment_intent_id) DO UPDATE
           SET status = EXCLUDED.status
           RETURNING *;`,
          [
            session.payment_intent,
            1,
            session.amount_total / 100,
            session.currency,
            success ? 'succeeded' : 'failed',
            session.created,
            customerName || null
          ]
        );
        console.log('✅ Pago registrado:', session.payment_intent, '- Estado:', status);

        // LÓGICA ADICIONAL ESPECÍFICA PARA SEGUROS
        if (productKey === 'insurance') {
          console.log('🛡️ PROCESANDO ACTUALIZACIÓN DE SEGURO');
          
          const userEmail = session.metadata?.user_email;
          const seguroNombre = session.metadata?.seguro_nombre;
          
          console.log('📧 Email del usuario:', userEmail);
          console.log('🏥 Nombre del seguro:', seguroNombre);
          
          if (!userEmail) {
            console.log('❌ ERROR: user_email no encontrado en metadata');
          } else if (!seguroNombre) {
            console.log('❌ ERROR: seguro_nombre no encontrado en metadata');
          } else {
            try {
              console.log('🔄 Ejecutando UPDATE en tabla patients...');
              const updateResult = await client.query(
                'UPDATE patients SET seguro = $1 WHERE email = $2 RETURNING id, email, seguro',
                [seguroNombre, userEmail]
              );
              
              console.log('📊 Resultado del UPDATE:');
              console.log('  - Filas afectadas:', updateResult.rowCount);
              console.log('  - Datos actualizados:', updateResult.rows);
              
              if (updateResult.rowCount > 0) {
                console.log('✅ SEGURO ACTUALIZADO EXITOSAMENTE');
              } else {
                console.log('⚠️ NO SE ENCONTRÓ PACIENTE CON ESE EMAIL');
                
                // VERIFICAR SI EL PACIENTE EXISTE
                const checkUser = await client.query('SELECT id, email FROM patients WHERE email = $1', [userEmail]);
                console.log('🔍 Verificación de usuario existente:', checkUser.rows);
              }
              
            } catch (updateError) {
              console.error('💥 ERROR EN UPDATE:', updateError);
              console.error('  - Message:', updateError.message);
              console.error('  - Code:', updateError.code);
              console.error('  - Detail:', updateError.detail);
            }
          }
        }
      }

      return { 
        statusCode: 200, 
        headers: corsHeaders,
        body: JSON.stringify({ success }) 
      };
    }

    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método no permitido' }) 
    };

  } catch (err) {
    console.error('Error:', err);
    return { 
      statusCode: 400, 
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }) 
    };
  }
};