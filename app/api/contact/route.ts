import { NextRequest, NextResponse } from 'next/server'

// Función para enviar email con Resend (Opción 1 - Recomendada)
async function sendWithResend(data: any) {
  const { name, email, phone, subject, message, type } = data
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'contacto@cristolasolucion.com', // Cambiar por tu dominio
        to: ['oficinasclsj@gmail.com'],
        subject: `Nueva petición: ${subject || type}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Nueva Petición de Contacto</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
              <p><strong>Tipo de petición:</strong> ${type}</p>
              ${subject ? `<p><strong>Asunto:</strong> ${subject}</p>` : ''}
            </div>
            <div style="background: white; padding: 20px; border-left: 4px solid #2563eb;">
              <h3>Mensaje:</h3>
              <p style="line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Enviado desde el sitio web de Cristo La Solución
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      throw new Error('Error enviando email con Resend')
    }

    return { success: true }
  } catch (error) {
    console.error('Error con Resend:', error)
    throw error
  }
}

// Función para enviar email con EmailJS (Opción 2 - Sin backend)
async function sendWithEmailJS(data: any) {
  // Esta función se ejecutaría en el frontend, no aquí
  // La incluyo como referencia
  return { success: true }
}

// Función para enviar con Formspree (Opción 3 - Servicio externo)
async function sendWithFormspree(data: any) {
  try {
    const response = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error enviando con Formspree')
    }

    return { success: true }
  } catch (error) {
    console.error('Error con Formspree:', error)
    throw error
  }
}

// Función para guardar en archivo JSON (Opción 4 - Desarrollo/Testing)
async function saveToFile(data: any) {
  const fs = require('fs').promises
  const path = require('path')
  
  try {
    const filePath = path.join(process.cwd(), 'peticiones.json')
    let peticiones = []
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8')
      peticiones = JSON.parse(fileContent)
    } catch (error) {
      // Archivo no existe, crear nuevo array
    }
    
    peticiones.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now()
    })
    
    await fs.writeFile(filePath, JSON.stringify(peticiones, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error guardando en archivo:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, type } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Preparar datos
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      type,
      timestamp: new Date().toISOString()
    }

    // Intentar enviar con diferentes métodos (en orden de preferencia)
    let emailSent = false
    let errorMessage = ''

    // Opción 1: Resend (si está configurado)
    if (process.env.RESEND_API_KEY && !emailSent) {
      try {
        await sendWithResend(contactData)
        emailSent = true
        console.log('Email enviado con Resend')
      } catch (error) {
        console.log('Resend no disponible, intentando siguiente método')
        errorMessage += 'Resend falló. '
      }
    }

    // Opción 2: Formspree (si está configurado)
    if (process.env.FORMSPREE_FORM_ID && !emailSent) {
      try {
        await sendWithFormspree(contactData)
        emailSent = true
        console.log('Email enviado con Formspree')
      } catch (error) {
        console.log('Formspree no disponible, intentando siguiente método')
        errorMessage += 'Formspree falló. '
      }
    }

    // Opción 3: Guardar en archivo (siempre como backup)
    try {
      await saveToFile(contactData)
      console.log('Petición guardada en archivo')
    } catch (error) {
      console.log('Error guardando en archivo:', error)
    }

    // Respuesta exitosa
    return NextResponse.json(
      { 
        success: true, 
        message: emailSent 
          ? 'Tu petición ha sido enviada exitosamente. Nos pondremos en contacto contigo pronto.'
          : 'Tu petición ha sido recibida y será procesada pronto. Nos pondremos en contacto contigo.',
        emailSent
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error procesando petición:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}