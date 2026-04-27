import { Router } from 'express'
import { supabase } from '../db.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Todos los endpoints requieren auth + rol admin
router.use(authenticate, requireAdmin)

// ── USUARIOS ──────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ users })
})

// PATCH /api/admin/users/:id  — cambiar role o bloquear
router.patch('/users/:id', async (req, res) => {
  const { role, blocked } = req.body
  const updates = {}
  if (role) updates.role = role
  if (typeof blocked === 'boolean') updates.blocked = blocked

  const { data, error } = await supabase
    .from('users').update(updates).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ user: data })
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

// ── PRODUCTOS ─────────────────────────────────────────────

// POST /api/admin/products
router.post('/products', async (req, res) => {
  const { name, category, price, image, badge, description, stock, sizes, colors, features, is_featured } = req.body
  if (!name || !category || !price)
    return res.status(400).json({ error: 'Nombre, categoría y precio son requeridos' })

  // Generar slug
  const slug = name.toLowerCase()
    .replace(/[áéíóúñ]/g, m => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }[m]))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

  // Obtener category_id
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category.toLowerCase())
    .single()

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      category,
      category_id: categoryData?.id || null,
      slug,
      price,
      image: image || null,
      badge: badge || null,
      description: description || null,
      stock: stock ?? 100,
      sizes: sizes || ["38", "39", "40", "41", "42", "43", "44"],
      colors: colors || ["Negro", "Blanco", "Gris"],
      features: features || [],
      is_featured: is_featured ?? false,
      status: (stock ?? 100) === 0 ? 'out_of_stock' : 'active'
    })
    .select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ product: data })
})

// PATCH /api/admin/products/:id
router.patch('/products/:id', async (req, res) => {
  const { name, category, price, image, badge, description, stock, sizes, colors, features, is_featured } = req.body
  const updates = {}
  
  if (name !== undefined) {
    updates.name = name
    // Regenerar slug si cambia el nombre
    updates.slug = name.toLowerCase()
      .replace(/[áéíóúñ]/g, m => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }[m]))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }
  if (category !== undefined) {
    updates.category = category
    // Actualizar category_id
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.toLowerCase())
      .single()
    updates.category_id = categoryData?.id || null
  }
  if (price !== undefined) updates.price = price
  if (image !== undefined) updates.image = image
  if (badge !== undefined) updates.badge = badge
  if (description !== undefined) updates.description = description
  if (stock !== undefined) {
    updates.stock = stock
    updates.status = stock === 0 ? 'out_of_stock' : 'active'
  }
  if (sizes !== undefined) updates.sizes = sizes
  if (colors !== undefined) updates.colors = colors
  if (features !== undefined) updates.features = features
  if (is_featured !== undefined) updates.is_featured = is_featured

  const { data, error } = await supabase
    .from('products').update(updates).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ product: data })
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

// ── PEDIDOS ───────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ orders: orders.map(o => ({ ...o, items: o.order_items })) })
})

// PATCH /api/admin/orders/:id  — cambiar status
router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'paid', 'shipped', 'cancelled']
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Estado inválido' })

  const { data, error } = await supabase
    .from('orders').update({ status }).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ order: data })
})

// ── STATS ─────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [
    { count: totalUsers },
    { data: orders },
    { count: totalProducts },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, status, created_at'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])

  const totalRevenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const totalOrders = orders?.length || 0

  // Calcular ingresos por mes (últimos 6 meses)
  const monthlyRevenue = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    
    const monthOrders = orders?.filter(o => {
      const orderDate = new Date(o.created_at)
      return orderDate >= monthStart && orderDate <= monthEnd
    }) || []
    
    const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    monthlyRevenue.push({
      month: d.toLocaleString('es-PE', { month: 'short' }),
      revenue
    })
  }

  res.json({
    stats: {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      monthlyRevenue
    }
  })
})

export default router
