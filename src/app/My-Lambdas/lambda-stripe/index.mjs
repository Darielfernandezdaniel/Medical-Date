import { readFileSync } from 'fs';
import { Pool } from 'pg';
import Stripe from 'stripe';
import https from 'https';
import { URL } from 'url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

let db;
let cachedPruebas = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getDb() {
  if (!db) {
    db = new Pool({
      host: process.env.DB_HOST,
      port: 5432,
      user: process.env.DB_USERS,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true,
        ca: readFileSync('/opt/lambda-layer/nodejs/eu-central-1-bundle.pem').toString(),
      },
    });
    console.log("✅ Nueva conexión DB inicializada");
  }
  return db;
}

async function fetchCloudFrontData() {
  if (cachedPruebas && (Date.now() - cacheTime) < CACHE_TTL) {
    console.log("✅ Usando datos en cache de CloudFront");
    return cachedPruebas;
  }

  const CF_JSON_URL = process.env.CF_JSON_URL;
  if (!CF_JSON_URL) {
    throw new Error("CF_JSON_URL no está configurada");
  }

  console.log("🔄 Obteniendo datos de CloudFront con HTTPS nativo:", CF_JSON_URL);

  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(CF_JSON_URL);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        timeout: 8000,
        headers: {
          'User-Agent': 'AWS-Lambda/nodejs22.x',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'close'
        }
      };

      console.log("🔗 Conectando a:", options.hostname + options.path);

      const req = https.get(options, (res) => {
        console.log(`📡 Status: ${res.statusCode}`);
        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let data = '';
        res.on('data', chunk => { data += chunk; });
        
        res.on('end', () => {
          try {
            const pruebas = JSON.parse(data);
            cachedPruebas = pruebas;
            cacheTime = Date.now();
            console.log("✅ Datos de CloudFront obtenidos correctamente con HTTPS nativo");
            resolve(pruebas);
          } catch (parseError) {
            console.error("❌ Error parseando JSON:", parseError.message);
            reject(new Error(`Error parseando JSON: ${parseError.message}`));
          }
        });
      });

      req.on('error', (err) => {
        console.error("❌ Error de red:", err.message);
        reject(new Error(`Error de red: ${err.message}`));
      });

      req.on('timeout', () => {
        console.log("⏰ Timeout en request HTTPS");
        req.destroy();
        reject(new Error("Timeout al conectar con CloudFront"));
      });

    } catch (urlError) {
      console.error("❌ Error parseando URL:", urlError.message);
      reject(new Error(`URL inválida: ${urlError.message}`));
    }
  });
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const startTime = Date.now();
  
  try {
    const { email, items } = JSON.parse(event.body);

    if (!email || !items) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Email e items son requeridos' }),
      };
    }

    const db = getDb();

    const seguroRes = await db.query(
      `SELECT seguro FROM patients WHERE email = $1 AND seguro IS NOT NULL`,
      [email]
    );

    const asegurado = await db.query(
      'Select nombre, apellido From patients where email = $1',
      [email]
    )

    let nombreCompleto = '';
    if (asegurado.rows.length > 0) {
      const { nombre, apellido } = asegurado.rows[0];
      nombreCompleto = `${nombre} ${apellido}`; 
    }

    const seguroActivo = seguroRes.rowCount > 0;
    let pruebaCubierta = false;

    if (seguroActivo) {
      const nombreSeguro = seguroRes.rows[0].seguro;
      
      try {
        // ✅ Cambio aquí: medicaltest en lugar de pruebas
        const pruebaRes = await db.query(
          `SELECT id_prueba FROM medicaltest WHERE nombre_prueba = $1 LIMIT 1`,
          [items]
        );

        if (pruebaRes.rowCount > 0) {
          const idPrueba = pruebaRes.rows[0].id_prueba;
          
          const cobertura = await db.query(
            `SELECT 1 
             FROM segurospruebas sp
             JOIN seguros s ON sp.id_seguro = s.id_seguro
             WHERE s.nombre = $1 AND sp.id_prueba = $2
             LIMIT 1`,
            [nombreSeguro, idPrueba]
          );
          
          pruebaCubierta = cobertura.rowCount > 0;
        } else {
          console.log(`⚠️ Prueba "${items}" no encontrada en tabla medicaltest`);
          pruebaCubierta = false;
        }
      } catch (dbError) {
        console.error("❌ Error consultando cobertura:", dbError.message);
        pruebaCubierta = false;
      }
    }

    if (pruebaCubierta) {
      console.log(`✅ Prueba cubierta para ${email} - Tiempo: ${Date.now() - startTime}ms`);
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ asegurado: true }),
      };
    }

    const pruebas = await fetchCloudFrontData();
    const pruebaInfo = pruebas[items];

    if (!pruebaInfo) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Prueba no encontrada en CloudFront JSON' }),
      };
    }

    const precioCentavos = parseFloat(pruebaInfo.precio.replace(/[^0-9.]/g, '')) * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: pruebaInfo.titulo, 
            description: pruebaInfo.descripcion 
          },
          unit_amount: Math.round(precioCentavos),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || 'http://localhost:4200/payment',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:4200/payment',
      metadata: {
        product_key: 'test',
        customer_name: nombreCompleto
      }
    });

    console.log(`✅ Sesión Stripe creada: ${session.id} - Tiempo total: ${Date.now() - startTime}ms`);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ asegurado: false, sessionId: session.id }),
    };

  } catch (error) {
    console.error("❌ Error en Lambda:", {
      message: error.message,
      stack: error.stack,
      duration: Date.now() - startTime
    });
    
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ 
        error: "Error interno del servidor",
        details: error.message 
      }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };
}
