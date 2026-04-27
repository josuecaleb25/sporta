import { Router } from 'express'
import { supabase } from '../db.js'

const FORMSPREE_CONTACT = 'https://formspree.io/f/xblzqqlw'

const router = Router()

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message)
    return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' })
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: 'Email inválido' })

  await supabase.from('contacts').insert({ name, email, subject: subject || null, message })

  try {
    await fetch(FORMSPREE_CONTACT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message, _replyto: email }),
    })
  } catch (err) {
    console.error('Formspree contact error:', err.message)
  }

  res.status(201).json({ message: 'Mensaje recibido. Te responderemos pronto.' })
})

export default router
