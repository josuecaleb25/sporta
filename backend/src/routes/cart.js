import { Router } from 'express'
import { supabase } from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/cart
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })

  const cart = data.map(item => ({
    id: item.id, // ID del item del carrito (no del producto)
    productId: item.products.id,
    name: item.products.name,
    price: item.products.price,
    image: item.products.image,
    badge: item.products.badge,
    quantity: item.quantity,
    selectedSize: item.selected_size,
    selectedColor: item.selected_color,
  }))

  res.json({ cart })
})

// POST /api/cart  — agrega o incrementa
router.post('/', authenticate, async (req, res) => {
  const { product_id, quantity = 1, selected_size, selected_color } = req.body
  if (!product_id) return res.status(400).json({ error: 'product_id requerido' })

  // Buscar item existente con mismo producto, talla y color
  let query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', req.user.id)
    .eq('product_id', product_id)

  // Filtrar por talla y color si se proporcionan
  if (selected_size) query = query.eq('selected_size', selected_size)
  else query = query.is('selected_size', null)
  
  if (selected_color) query = query.eq('selected_color', selected_color)
  else query = query.is('selected_color', null)

  const { data: existing } = await query.single()

  if (existing) {
    // Incrementar cantidad del item existente
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) return res.status(500).json({ error: error.message })
  } else {
    // Crear nuevo item en el carrito
    const { error } = await supabase
      .from('cart_items')
      .insert({ 
        user_id: req.user.id, 
        product_id, 
        quantity,
        selected_size: selected_size || null,
        selected_color: selected_color || null
      })
    if (error) return res.status(500).json({ error: error.message })
  }

  res.json({ ok: true })
})

// PATCH /api/cart/:id  — actualiza cantidad (usa ID del cart_item, no del producto)
router.patch('/:id', authenticate, async (req, res) => {
  const { quantity } = req.body
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Cantidad inválida' })

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

// DELETE /api/cart/:id (usa ID del cart_item, no del producto)
router.delete('/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

// DELETE /api/cart  — vaciar carrito
router.delete('/', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

export default router
