import { Router } from 'express'
import { supabase } from '../db.js'
import { authenticate } from '../middleware/auth.js'
import { sendOrderConfirmationEmail } from '../services/emailService.js'

const FORMSPREE_ORDERS = 'https://formspree.io/f/xrerjbkw'

const router = Router()

// POST /api/orders
router.post('/', authenticate, async (req, res) => {
  const {
    name, email, phone, address, district,
    reference, delivery_notes, payment_method, items
  } = req.body

  if (!name || !email || !phone || !address || !district || !payment_method)
    return res.status(400).json({ error: 'Faltan campos obligatorios de envío' })
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'El carrito está vacío' })

  const validPayments = ['credit', 'yape', 'transfer', 'cash']
  if (!validPayments.includes(payment_method))
    return res.status(400).json({ error: 'Método de pago inválido' })

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const total = subtotal + shipping

  // Determinar estado inicial según método de pago
  let status = 'pending' // Por defecto: pendiente
  
  if (payment_method === 'credit') {
    // Tarjeta de crédito: se asume pago inmediato
    status = 'paid'
  } else if (payment_method === 'yape') {
    // Yape/Plin: se asume pago inmediato (en producción verificarías con API)
    status = 'paid'
  } else if (payment_method === 'transfer') {
    // Transferencia bancaria: requiere verificación manual
    status = 'pending'
  } else if (payment_method === 'cash') {
    // Contra entrega: pendiente hasta la entrega
    status = 'pending'
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: req.user.id, name, email, phone, address, district,
      reference: reference || null, delivery_notes: delivery_notes || null,
      payment_method, subtotal, shipping, total, status
    })
    .select().single()

  if (orderError || !order) {
    console.error('ORDER ERROR:', JSON.stringify(orderError))
    return res.status(500).json({ error: 'Error al crear el pedido', detail: orderError?.message })
  }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id || null,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || null,
    selected_size: item.selectedSize || null,
    selected_color: item.selectedColor || null
  }))

  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items').insert(orderItems).select()

  if (itemsError) {
    console.error('ITEMS ERROR:', JSON.stringify(itemsError))
    return res.status(500).json({ error: 'Error al guardar los items del pedido', detail: itemsError?.message })
  }

  // Generar número de comprobante
  const receiptNumber = `COMP-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`

  // Preparar datos para el email
  const emailData = {
    receiptNumber,
    orderId: order.id,
    name,
    email,
    phone,
    address,
    district,
    reference: reference || '',
    deliveryNotes: delivery_notes || '',
    paymentMethod: payment_method,
    items: items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize || '',
      selectedColor: item.selectedColor || ''
    })),
    subtotal,
    shipping,
    total,
    orderDate: new Date().toLocaleString('es-PE')
  }

  // Enviar email con Gmail/Resend (principal)
  console.log('📧 Enviando email de confirmación...')
  const emailResult = await sendOrderConfirmationEmail(emailData)
  
  if (emailResult.success) {
    console.log(`✅ Email enviado con ${emailResult.provider}`)
  } else {
    console.error('❌ Error enviando email:', emailResult.error)
  }

  // Notificar via Formspree (respaldo)
  try {
    await fetch(FORMSPREE_ORDERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `Nuevo Pedido #${order.id} - ${receiptNumber}`,
        _replyto: email,
        receiptNumber, orderId: order.id,
        name, email, phone,
        address: `${address}, ${district}`,
        reference: reference || '-',
        paymentMethod: payment_method,
        items: items.map(i => `${i.name} x${i.quantity} = S/ ${(i.price * i.quantity).toFixed(2)}`).join(' | '),
        subtotal: `S/ ${subtotal.toFixed(2)}`,
        shipping: shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`,
        total: `S/ ${total.toFixed(2)}`,
        orderDate: new Date().toLocaleString('es-PE'),
      }),
    })
  } catch (err) {
    console.error('Formspree orders error:', err.message)
  }

  res.status(201).json({ order: { ...order, items: insertedItems } })
})

// GET /api/orders
router.get('/', authenticate, async (req, res) => {
  const { data: orders, error } = await supabase
    .from('orders').select('*, order_items(*)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ orders: orders.map(o => ({ ...o, items: o.order_items })) })
})

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  const { data: order, error } = await supabase
    .from('orders').select('*, order_items(*)')
    .eq('id', req.params.id).single()

  if (error || !order) return res.status(404).json({ error: 'Pedido no encontrado' })
  if (order.user_id !== req.user.id)
    return res.status(403).json({ error: 'No tienes acceso a este pedido' })

  res.json({ order: { ...order, items: order.order_items } })
})

export default router
