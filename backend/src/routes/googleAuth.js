import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase } from '../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'sporta_secret_2026'

// POST /api/auth/google  — verifica id_token (credential de One Tap)
router.post('/google', async (req, res) => {
  const { credential } = req.body
  if (!credential) return res.status(400).json({ error: 'Token de Google requerido' })

  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`)
    const payload = await response.json()
    if (payload.error) return res.status(401).json({ error: 'Token de Google inválido' })

    const { email, name, sub: googleId } = payload
    let { data: user } = await supabase.from('users').select('*').eq('email', email).single()

    if (!user) {
      const { data: newUser, error } = await supabase
        .from('users').insert({ name, email, password: `google_${googleId}` }).select().single()
      if (error || !newUser) return res.status(500).json({ error: 'No se pudo crear el usuario' })
      user = newUser
    }

    // Verificar si el usuario está bloqueado
    if (user.blocked)
      return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' })

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Google auth error:', err)
    res.status(500).json({ error: 'Error al verificar con Google' })
  }
})

// POST /api/auth/google-token  — recibe userinfo ya obtenido desde el frontend
router.post('/google-token', async (req, res) => {
  const { email, name, googleId, isRegister } = req.body
  if (!email || !name) return res.status(400).json({ error: 'Datos de Google incompletos' })

  try {
    let { data: user } = await supabase.from('users').select('*').eq('email', email).single()

    if (!user) {
      if (!isRegister)
        return res.status(401).json({ error: 'No tienes una cuenta registrada. Regístrate primero.' })

      const { data: newUser, error } = await supabase
        .from('users').insert({ name, email, password: `google_${googleId || 'oauth'}` }).select().single()
      if (error || !newUser) return res.status(500).json({ error: 'No se pudo crear el usuario' })
      user = newUser
    }

    // Verificar si el usuario está bloqueado
    if (user.blocked)
      return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' })

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Google token auth error:', err.message)
    res.status(500).json({ error: 'Error al procesar login con Google' })
  }
})

export default router
