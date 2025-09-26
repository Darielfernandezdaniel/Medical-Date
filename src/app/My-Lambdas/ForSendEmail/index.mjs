import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Headers CORS para todas las respuestas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

// Tu email para recibir las notificaciones
const MI_EMAIL = 'darieltwitter46@gmail.com'; // Cambia por tu email

async function enviarEmailCliente(to, nombreCompleto) {
  const msg = {
    to,
    from: 'darieltwitter46@gmail.com',
    subject: '✅ Confirmación - Ticket Recibido',
    text: `Hola ${nombreCompleto},

Hemos recibido tu ticket de soporte y lo procesaremos cuanto antes.

Gracias por contactarnos.

Saludos,
Equipo de Soporte`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Ticket</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #e3f2fd; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <!-- Container principal -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e3f2fd; padding: 40px 20px;">
          <tr>
            <td align="center">
              
              <!-- Card principal -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(33, 150, 243, 0.15); overflow: hidden;">
                
                <!-- Header con gradiente -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #03DAC6 100%); padding: 0; height: 8px;">
                  </td>
                </tr>
                
                <!-- Contenido principal -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <!-- Icono de confirmación -->
                    <div style="text-align: center; display:flex; justify-content:center; align-items:center">
                      <div style="background: linear-gradient(135deg, #2196F3, #21CBF3); width: 110px; height: 80px; border-radius: 50%; margin: 0 auto; position: relative; box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);">
                        <span style="color: white; font-size: 60px; width:50%; height:50%; font-weight: bolder; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">✓</span>
                      </div>
                    </div>
                    
                    <!-- Título -->
                    <h1 style="color: #1565C0; text-align: center; margin: 0 0 30px 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      ¡Ticket Recibido!
                    </h1>
                    
                    <!-- Saludo personalizado -->
                    <div style="background: linear-gradient(90deg, #E3F2FD, #F0F8FF); border-left: 4px solid #2196F3; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                      <h2 style="color: #1565C0; margin: 0 0 10px 0; font-size: 22px;">
                        Hola <span style="color: #0277BD;">${nombreCompleto}</span> 👋
                      </h2>
                    </div>
                    
                    <!-- Mensaje principal -->
                    <div style="background-color: #FAFAFA; padding: 25px; border-radius: 12px; border: 1px solid #E1F5FE; margin-bottom: 30px;">
                      <p style="color: #424242; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        Hemos recibido tu ticket de soporte y nuestro equipo lo está revisando.
                      </p>
                      <p style="color: #424242; font-size: 16px; line-height: 1.6; margin: 0;">
                        Te responderemos cuanto antes para ayudarte con tu consulta.
                      </p>
                    </div>
                    
                    <!-- Info adicional -->
                    <div style="background: linear-gradient(135deg, #E8F5E8, #E3F2FD); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #B3E5FC;">
                      <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 18px; margin-right: 10px;">⏱️</span>
                        <strong style="color: #1565C0;">Tiempo de respuesta estimado:</strong>
                      </div>
                      <p style="color: #424242; margin: 5px 0 0 28px; font-size: 14px;">
                        Menos de 24 horas en días laborables
                      </p>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="mailto:darieltwitter46@gmail.com" style="background: linear-gradient(135deg, #2196F3, #21CBF3); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); transition: transform 0.2s;">
                        📧 Contáctanos Directamente
                      </a>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F5F5F5; padding: 25px 30px; border-top: 1px solid #E0E0E0;">
                    <div style="text-align: center;">
                      <p style="color: #1565C0; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                        Gracias por confiar en nosotros
                      </p>
                      <p style="color: #757575; margin: 0; font-size: 14px;">
                        Saludos,<br>
                        <strong style="color: #2196F3;">Equipo de Soporte</strong>
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer bottom -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #03DAC6 100%); padding: 15px; text-align: center;">
                    <p style="color: white; margin: 0; font-size: 12px; opacity: 0.9;">
                      © 2025 OverHealthy • Soporte Premium
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email de confirmación enviado a cliente:", to);
  } catch (error) {
    console.error("❌ Error enviando email al cliente:", error);
    throw error;
  }
}

async function enviarEmailNotificacion(clienteEmail, nombreCompleto, datosAdicionales = {}) {
  const msg = {
    to: MI_EMAIL,
    from: 'darieltwitter46@gmail.com',
    subject: `🎫 Nuevo Ticket de Soporte - ${nombreCompleto}`,
    text: `Has recibido un nuevo ticket de soporte:

Cliente: ${nombreCompleto}
Email: ${clienteEmail}
Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}

${datosAdicionales.mensaje ? `Mensaje: ${datosAdicionales.mensaje}` : ''}
${datosAdicionales.telefono ? `Teléfono: ${datosAdicionales.telefono}` : ''}
${datosAdicionales.empresa ? `Empresa: ${datosAdicionales.empresa}` : ''}

---
Responde al cliente directamente a: ${clienteEmail}`,
    html: `
      <div style="background-color:#fff; padding:20px; font-family:Arial, sans-serif; border-left:4px solid #007cba;">
        <h2 style="color:#007cba;">🎫 Nuevo Ticket de Soporte</h2>
        
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px; background-color:#f9f9f9; font-weight:bold;">Cliente:</td>
            <td style="padding:8px;">${nombreCompleto}</td>
          </tr>
          <tr>
            <td style="padding:8px; background-color:#f9f9f9; font-weight:bold;">Email:</td>
            <td style="padding:8px;"><a href="mailto:${clienteEmail}">${clienteEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:8px; background-color:#f9f9f9; font-weight:bold;">Fecha:</td>
            <td style="padding:8px;">${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td>
          </tr>
          ${datosAdicionales.telefono ? `
          <tr>
            <td style="padding:8px; background-color:#f9f9f9; font-weight:bold;">Teléfono:</td>
            <td style="padding:8px;">${datosAdicionales.telefono}</td>
          </tr>` : ''}
        <hr style="margin:20px 0;">
        <p><strong>Responder directamente a:</strong> <a href="mailto:${clienteEmail}">${clienteEmail}</a></p>
      </div>
    `
  };
  console.log(datosAdicionales.telefono)
  try {
    await sgMail.send(msg);
    console.log("✅ Email de notificación enviado a:", MI_EMAIL);
  } catch (error) {
    console.error("❌ Error enviando email de notificación:", error);
    throw error;
  }
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // 🔥 MANEJAR PREFLIGHT OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    console.log("📩 Event body:", event.body);

    if (!event.body) {
      throw new Error('Body requerido');
    }

    const data = JSON.parse(event.body);
    const { email, nombreCompleto, mensaje, telefono} = data;

    // Validar campos obligatorios
    if (!email || !nombreCompleto) {
      throw new Error('Email y nombreCompleto son requeridos');
    }

    console.log("📧 Enviando emails para:", nombreCompleto, "(" + email + ")");

    // Enviar email de confirmación al cliente
    await enviarEmailCliente(email, nombreCompleto);

    // Enviar email de notificación a ti con los datos del cliente
    await enviarEmailNotificacion(email, nombreCompleto, {
      mensaje,
      telefono,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Emails enviados correctamente',
        enviados: {
          cliente: email,
          notificacion: MI_EMAIL
        }
      })
    };

  } catch (error) {
    console.error("❌ Error en Lambda:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};