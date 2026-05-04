import { Resend } from 'resend'
import pkg from 'nodemailer'
import sgMail from '@sendgrid/mail'
const { createTransport } = pkg

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Inicializar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('✅ SendGrid configurado')
}

// Crear transportador de Gmail
const createGmailTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('⚠️ Gmail no configurado (falta GMAIL_USER o GMAIL_APP_PASSWORD)')
    return null
  }
  
  try {
    console.log('✅ Creando transportador de Gmail...')
    return createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })
  } catch (error) {
    console.error('❌ Error creando transportador de Gmail:', error)
    return null
  }
}

// Generar HTML del comprobante
const generateReceiptHTML = (orderData) => {
  const {
    receiptNumber,
    orderId,
    name,
    email,
    phone,
    address,
    district,
    reference,
    deliveryNotes,
    paymentMethod,
    items,
    subtotal,
    shipping,
    total,
    orderDate
  } = orderData

  const paymentMethodNames = {
    credit: 'Tarjeta de Crédito/Débito',
    yape: 'Yape/Plin',
    transfer: 'Transferencia Bancaria',
    cash: 'Pago contra entrega'
  }

  const itemsHTML = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 8px;">
        <strong>${item.name}</strong>
        ${item.selectedSize ? `<br><small style="color: #666;">Talla: ${item.selectedSize}</small>` : ''}
        ${item.selectedColor ? `<br><small style="color: #666;">Color: ${item.selectedColor}</small>` : ''}
      </td>
      <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right;">S/ ${item.price.toFixed(2)}</td>
      <td style="padding: 12px 8px; text-align: right;"><strong>S/ ${(item.price * item.quantity).toFixed(2)}</strong></td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante de Compra - SPORTA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Contenedor principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF4500 0%, #e03d00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">SPORTA</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Comprobante de Compra</p>
            </td>
          </tr>

          <!-- Confirmación -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <div style="display: inline-block; background-color: #4ade80; color: white; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: bold;">
                ✅ ¡PEDIDO CONFIRMADO!
              </div>
            </td>
          </tr>

          <!-- Información del comprobante -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #FF4500; padding-bottom: 10px;">
                      📄 Información del Pedido
                    </h2>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666; font-size: 14px;">Número de Pedido:</td>
                        <td style="text-align: right; font-weight: bold; color: #333;">#${orderId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Comprobante:</td>
                        <td style="text-align: right; font-weight: bold; color: #FF4500;">${receiptNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Fecha:</td>
                        <td style="text-align: right; font-weight: bold; color: #333;">${orderDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Método de Pago:</td>
                        <td style="text-align: right; font-weight: bold; color: #333;">${paymentMethodNames[paymentMethod]}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Información del cliente -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #FF4500; padding-bottom: 10px;">
                👤 Información del Cliente
              </h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px;">Nombre:</td>
                  <td style="text-align: right; font-weight: bold; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Email:</td>
                  <td style="text-align: right; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Teléfono:</td>
                  <td style="text-align: right; color: #333;">${phone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dirección de envío -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #FF4500; padding-bottom: 10px;">
                📍 Dirección de Envío
              </h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px;">Dirección:</td>
                  <td style="text-align: right; color: #333;">${address}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Distrito:</td>
                  <td style="text-align: right; font-weight: bold; color: #333;">${district}</td>
                </tr>
                ${reference ? `
                <tr>
                  <td style="color: #666; font-size: 14px;">Referencia:</td>
                  <td style="text-align: right; color: #333;">${reference}</td>
                </tr>
                ` : ''}
                ${deliveryNotes ? `
                <tr>
                  <td style="color: #666; font-size: 14px;">Notas:</td>
                  <td style="text-align: right; color: #333;">${deliveryNotes}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Productos -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #FF4500; padding-bottom: 10px;">
                🛒 Productos
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px 8px; text-align: left; color: #666; font-size: 13px; font-weight: 600;">Producto</th>
                    <th style="padding: 12px 8px; text-align: center; color: #666; font-size: 13px; font-weight: 600;">Cant.</th>
                    <th style="padding: 12px 8px; text-align: right; color: #666; font-size: 13px; font-weight: 600;">Precio</th>
                    <th style="padding: 12px 8px; text-align: right; color: #666; font-size: 13px; font-weight: 600;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totales -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 15px;">
                <tr>
                  <td style="color: #666; font-size: 15px;">Subtotal:</td>
                  <td style="text-align: right; font-size: 15px; color: #333;">S/ ${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 15px;">Envío:</td>
                  <td style="text-align: right; font-size: 15px; color: ${shipping === 0 ? '#4ade80' : '#333'};">
                    ${shipping === 0 ? '¡GRATIS!' : `S/ ${shipping.toFixed(2)}`}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #FF4500;">
                  <td style="color: #333; font-size: 18px; font-weight: bold; padding-top: 15px;">TOTAL:</td>
                  <td style="text-align: right; font-size: 22px; font-weight: bold; color: #FF4500; padding-top: 15px;">S/ ${total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Información de entrega -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fff3e0; border-left: 4px solid #FF4500; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                  <strong style="color: #FF4500;">⏰ Tiempo estimado de entrega:</strong> 2-3 días hábiles<br>
                  <strong style="color: #FF4500;">📦 Estado del pedido:</strong> ${paymentMethod === 'credit' || paymentMethod === 'yape' ? 'Pagado - En preparación' : 'Pendiente de pago'}
                </p>
              </div>
            </td>
          </tr>

          <!-- Mensaje de agradecimiento -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px;">¡Gracias por tu compra!</h3>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Tu pedido ha sido recibido y está siendo procesado.<br>
                Te notificaremos cuando tu pedido sea enviado.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #333; color: #fff;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; letter-spacing: 1px;">SPORTA</p>
              <p style="margin: 0 0 5px 0; font-size: 13px; color: #ccc;">
                📧 adminSporta@depor.pe | 📱 +51 925 841 052
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} SPORTA. Todos los derechos reservados.
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
}

// Enviar email de confirmación de pedido
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    // Intentar primero con SendGrid si está configurado
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      console.log('📧 Enviando email con SendGrid a:', orderData.email)
      
      try {
        const msg = {
          to: orderData.email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: `✅ Pedido Confirmado #${orderData.orderId} - SPORTA`,
          html: generateReceiptHTML(orderData)
        }

        const response = await sgMail.send(msg)
        console.log('✅ Email enviado exitosamente con SendGrid')
        return { success: true, messageId: response[0].headers['x-message-id'], provider: 'sendgrid' }
      } catch (sendgridError) {
        console.warn('⚠️ SendGrid falló:', sendgridError.message)
        // Continuar con Gmail si SendGrid falla
      }
    }

    // Intentar con Gmail si SendGrid falla o no está configurado
    const gmailTransporter = createGmailTransporter()
    
    if (gmailTransporter) {
      console.log('📧 Enviando email con Gmail a:', orderData.email)
      
      try {
        // Agregar timeout de 10 segundos
        const emailPromise = gmailTransporter.sendMail({
          from: process.env.GMAIL_FROM || `"SPORTA" <${process.env.GMAIL_USER}>`,
          to: orderData.email,
          subject: `✅ Pedido Confirmado #${orderData.orderId} - SPORTA`,
          html: generateReceiptHTML(orderData)
        })

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gmail timeout después de 10 segundos')), 10000)
        )

        const info = await Promise.race([emailPromise, timeoutPromise])
        
        console.log('✅ Email enviado exitosamente con Gmail. ID:', info.messageId)
        return { success: true, messageId: info.messageId, provider: 'gmail' }
      } catch (gmailError) {
        console.warn('⚠️ Gmail falló:', gmailError.message)
        // Continuar con Resend si Gmail falla
      }
    }
    
    // Si SendGrid y Gmail fallan, intentar con Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ Ningún servicio de email está configurado. Email no enviado.')
      return { success: false, error: 'No email service configured' }
    }

    console.log('📧 Enviando email con Resend a:', orderData.email)

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SPORTA <onboarding@resend.dev>',
      to: orderData.email,
      subject: `✅ Pedido Confirmado #${orderData.orderId} - SPORTA`,
      html: generateReceiptHTML(orderData)
    })

    if (error) {
      console.error('❌ Error enviando email con Resend:', error)
      return { success: false, error: error.message, provider: 'resend' }
    }

    console.log('✅ Email enviado exitosamente con Resend. ID:', data.id)
    return { success: true, messageId: data.id, provider: 'resend' }

  } catch (error) {
    console.error('❌ Error en sendOrderConfirmationEmail:', error.message)
    return { success: false, error: error.message }
  }
}

// Función de prueba para verificar la configuración
export const testEmailConfiguration = async () => {
  try {
    // Probar Gmail primero
    const gmailTransporter = createGmailTransporter()
    if (gmailTransporter) {
      try {
        await gmailTransporter.verify()
        return { success: true, message: 'Gmail configuration is valid', provider: 'gmail' }
      } catch (error) {
        console.error('Gmail verification failed:', error.message)
      }
    }
    
    // Probar Resend
    if (process.env.RESEND_API_KEY) {
      return { success: true, message: 'Resend API key is configured', provider: 'resend' }
    }
    
    return { success: false, error: 'No email service configured' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
