import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import googleAuthRoutes from './routes/googleAuth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import contactRoutes from './routes/contact.js'
import cartRoutes from './routes/cart.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://sporta-tawny.vercel.app',
  process.env.FRONTEND_URL || 'http://localhost:5173'
]

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true 
}))
app.use(express.json())

// Logger middleware para debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas
app.use('/api/auth',     authRoutes)
app.use('/api/auth',     googleAuthRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/contact',  contactRoutes)
app.use('/api/cart',     cartRoutes)
app.use('/api/admin',    adminRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ 
  status: 'ok', 
  app: 'Sporta API',
  timestamp: new Date().toISOString(),
  routes: [
    'GET  /api/health',
    'GET  /api/test-email',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET  /api/auth/me',
    'POST /api/auth/google',
    'GET  /api/products',
    'POST /api/orders',
    'POST /api/contact',
    'GET  /api/cart',
    'GET  /api/admin/stats'
  ]
}))

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendOrderConfirmationEmail } = await import('./services/emailService.js')
    
    const testData = {
      receiptNumber: 'TEST-' + Date.now(),
      orderId: 999,
      name: 'Cliente Prueba',
      email: req.query.email || 'valentinocuen123@gmail.com',
      phone: '+51 999 888 777',
      address: 'Av. Test 123',
      district: 'Miraflores',
      reference: 'Frente al parque',
      deliveryNotes: 'Timbre azul',
      paymentMethod: 'credit',
      items: [
        {
          name: 'Zapatilla Test',
          price: 100,
          quantity: 1,
          selectedSize: '42',
          selectedColor: 'Negro'
        }
      ],
      subtotal: 100,
      shipping: 0,
      total: 100,
      orderDate: new Date().toLocaleString('es-PE')
    }
    
    console.log('🧪 Enviando email de prueba a:', testData.email)
    const result = await sendOrderConfirmationEmail(testData)
    
    res.json({
      success: result.success,
      provider: result.provider,
      messageId: result.messageId,
      error: result.error,
      testEmail: testData.email
    })
  } catch (error) {
    console.error('Error en test-email:', error)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
})

// Root endpoint
app.get('/', (_, res) => res.json({ 
  message: 'Sporta API - E-Commerce Backend',
  version: '1.0.0',
  endpoints: '/api/health'
}))

// 404 handler
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.path}`)
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    suggestion: 'Verifica que la ruta comience con /api/'
  })
})

// Error handler
app.use((err, req, res, _next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message })
})

// Iniciar servidor
console.log('Iniciando Sporta API...')
console.log('Verificando conexión a Supabase...')

initDb()
  .then(() => {
    console.log('Conexión a Supabase exitosa')
    app.listen(PORT, () => {
      console.log('')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('SPORTA API CORRIENDO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`URL: http://localhost:${PORT}`)
      console.log(`Health: http://localhost:${PORT}/api/health`)
      console.log(`CORS: http://localhost:5173`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
    })
  })
  .catch(err => {
    console.error('Error al conectar con Supabase:', err.message)
    console.error('Verifica tu archivo .env y las credenciales de Supabase')
    process.exit(1)
  })
