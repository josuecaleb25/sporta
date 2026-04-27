import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'sporta_secret_2026'

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
  if (password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })

  const { data: existing } = await supabase
    .from('users').select('id').eq('email', email).single()
  
  if (existing)
    return res.status(409).json({ error: 'El email ya está registrado' })

  const hash = bcrypt.hashSync(password, 10)
  
  const { data: user, error } = await supabase
    .from('users').insert({ name, email, password: hash }).select().single()

  if (error)
    return res.status(500).json({ error: 'Error al crear el usuario: ' + error.message })
  
  if (!user)
    return res.status(500).json({ error: 'Error al crear el usuario, intentá de nuevo' })

  const token = jwt.sign({ id: user.id, name, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' })

  const { data: user } = await supabase
    .from('users').select('*').eq('email', email).single()

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Credenciales incorrectas' })

  // Verificar si el usuario está bloqueado
  if (user.blocked)
    return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' })

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No autenticado' })
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    const { data: user } = await supabase
      .from('users').select('id, name, email, created_at, role').eq('id', payload.id).single()
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ user })
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
})

// POST /api/auth/google/register - Para REGISTRO (crea usuarios nuevos)
// IMPORTANTE: Esta ruta debe ir ANTES de /google porque es más específica
router.post('/google/register', async (req, res) => {
  const { name, email, googleId, picture } = req.body
  
  if (!email || !googleId)
    return res.status(400).json({ error: 'Email y Google ID son requeridos' })

  try {
    // Buscar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users').select('*').eq('email', email).single()

    if (existingUser) {
      // Usuario ya existe - hacer login directamente
      if (existingUser.blocked)
        return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' })

      // Actualizar google_id si no lo tiene
      if (!existingUser.google_id) {
        await supabase
          .from('users')
          .update({ google_id: googleId, picture })
          .eq('id', existingUser.id)
      }

      const token = jwt.sign(
        { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      return res.json({ 
        token, 
        user: { 
          id: existingUser.id, 
          name: existingUser.name, 
          email: existingUser.email, 
          role: existingUser.role,
          picture: picture || existingUser.picture
        } 
      })
    }

    // Usuario NO existe - crear nuevo usuario
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ 
        name: name || email.split('@')[0], 
        email, 
        password: bcrypt.hashSync(Math.random().toString(36), 10), // Password aleatorio (no se usará)
        google_id: googleId,
        picture
      })
      .select()
      .single()

    if (error)
      return res.status(500).json({ error: 'Error al crear el usuario: ' + error.message })

    if (!newUser)
      return res.status(500).json({ error: 'Error al crear el usuario, intentá de nuevo' })

    // Generar token
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role,
        picture
      } 
    })
  } catch (err) {
    console.error('Error en Google OAuth Register:', err)
    res.status(500).json({ error: 'Error al procesar el registro con Google' })
  }
})

// POST /api/auth/google - Para LOGIN (solo usuarios existentes)
router.post('/google', async (req, res) => {
  const { name, email, googleId, picture } = req.body
  
  if (!email || !googleId)
    return res.status(400).json({ error: 'Email y Google ID son requeridos' })

  try {
    // Buscar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users').select('*').eq('email', email).single()

    if (!existingUser) {
      // Usuario NO existe - rechazar login
      return res.status(401).json({ 
        error: 'No tienes una cuenta registrada. Por favor regístrate primero.' 
      })
    }

    // Usuario existe - verificar si está bloqueado
    if (existingUser.blocked)
      return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' })

    // Actualizar google_id si no lo tiene
    if (!existingUser.google_id) {
      await supabase
        .from('users')
        .update({ google_id: googleId, picture })
        .eq('id', existingUser.id)
    }

    // Generar token
    const token = jwt.sign(
      { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    return res.json({ 
      token, 
      user: { 
        id: existingUser.id, 
        name: existingUser.name, 
        email: existingUser.email, 
        role: existingUser.role,
        picture: picture || existingUser.picture
      } 
    })
  } catch (err) {
    console.error('Error en Google OAuth:', err)
    res.status(500).json({ error: 'Error al procesar la autenticación con Google' })
  }
})

export default router
