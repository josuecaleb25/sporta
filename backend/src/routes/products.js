import { Router } from 'express'
import { supabase } from '../db.js'

const router = Router()

// GET /api/products?category=running&search=air&sort=price-asc
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query

  let query = supabase.from('products').select('*')

  if (category && category !== 'all') query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  if (sort === 'price-asc')  query = query.order('price', { ascending: true })
  else if (sort === 'price-desc') query = query.order('price', { ascending: false })
  else if (sort === 'name')  query = query.order('name', { ascending: true })
  else query = query.order('id', { ascending: true })

  const { data: products, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ products })
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { data: product, error } = await supabase
    .from('products').select('*').eq('id', req.params.id).single()
  if (error || !product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json({ product })
})

export default router
