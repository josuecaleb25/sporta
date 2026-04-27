import { useState } from 'react'
import { api } from '../api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await api.sendContact(formData)
      if (response.ok || response.message) {
        setSucceeded(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setError(response.error || 'Error al enviar el mensaje')
      }
    } catch (err) {
      console.error('Error enviando mensaje:', err)
      setError('Error al enviar el mensaje. Intenta nuevamente.')
    }
    setSubmitting(false)
  }

  const contactInfo = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Ubicación',
      value: 'Av. Javier Prado - Lima',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Email',
      value: 'adminSporta@depor.pe',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Teléfono',
      value: '+51 925 841 052',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Horario',
      value: 'Lun–Vie, 9am – 6pm',
    },
  ]

  if (succeeded) {
    return (
      <>
        <style>{`
          .contact-root { background:#080808; min-height:80vh; display:flex; align-items:center; justify-content:center; padding:2rem; font-family:'DM Sans',sans-serif; }
          .contact-success { text-align:center; max-width:420px; }
          .success-circle { width:80px; height:80px; background:rgba(74,222,128,.1); border:1px solid rgba(74,222,128,.25); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#4ade80; margin:0 auto 1.5rem; }
          .contact-success h2 { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; letter-spacing:2px; color:#fff; margin-bottom:.75rem; }
          .contact-success p { color:rgba(255,255,255,.45); font-size:.95rem; line-height:1.7; }
        `}</style>
        <div className="contact-root">
          <div className="contact-success">
            <div className="success-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>¡MENSAJE ENVIADO!</h2>
            <p>Gracias por contactarnos. Nuestro equipo te responderá en menos de 24 horas.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .contact-root {
          background: #080808;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }
        /* HEAD */
        .ct-head {
          padding: 5rem 2rem 3rem;
          text-align: center;
          position: relative; overflow: hidden;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .ct-head::before {
          content:''; position:absolute;
          width:500px; height:500px;
          background:radial-gradient(circle,rgba(255,69,0,.1) 0%,transparent 70%);
          top:-200px; left:50%; transform:translateX(-50%);
          pointer-events:none;
        }
        .ct-eyebrow {
          display:inline-flex; align-items:center; gap:.5rem;
          background:rgba(255,69,0,.1); border:1px solid rgba(255,69,0,.2);
          border-radius:50px; padding:.3rem .9rem;
          font-size:.7rem; letter-spacing:2px; text-transform:uppercase;
          color:#FF4500; font-weight:600; margin-bottom:1.25rem;
        }
        .ct-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(3rem,7vw,5.5rem);
          letter-spacing:2px; line-height:.95;
          margin-bottom:1rem;
        }
        .ct-subtitle {
          color:rgba(255,255,255,.4); font-size:.95rem;
          max-width:460px; margin:0 auto; line-height:1.7; font-weight:300;
        }

        /* BODY */
        .ct-body {
          max-width:1100px; margin:0 auto;
          padding:4rem 2rem;
          display:grid; grid-template-columns:1fr 1.6fr; gap:3rem; align-items:start;
        }

        /* INFO SIDE */
        .ct-info { display:flex; flex-direction:column; gap:1.5rem; }
        .ct-info-card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:14px; padding:1.25rem;
          display:flex; align-items:center; gap:1rem;
          transition:border-color .2s;
        }
        .ct-info-card:hover { border-color:rgba(255,69,0,.2); }
        .ct-info-icon {
          width:42px; height:42px; border-radius:10px;
          background:rgba(255,69,0,.1); border:1px solid rgba(255,69,0,.2);
          display:flex; align-items:center; justify-content:center;
          color:#FF4500; flex-shrink:0;
        }
        .ct-info-label { font-size:.68rem; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.3); font-weight:600; margin-bottom:2px; }
        .ct-info-val { color:#fff; font-size:.9rem; font-weight:500; }

        .ct-social-head { font-size:.7rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); font-weight:600; margin-bottom:.75rem; }
        .ct-socials { display:flex; gap:.6rem; }
        .ct-social-btn {
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.5); width:40px; height:40px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s; text-decoration:none;
        }
        .ct-social-btn:hover { background:rgba(255,69,0,.15); border-color:rgba(255,69,0,.3); color:#FF4500; }

        /* FORM SIDE */
        .ct-form-card {
          background:#111; border:1px solid rgba(255,255,255,.08);
          border-radius:20px; padding:2.5rem; overflow:hidden; position:relative;
        }
        .ct-form-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,#FF4500,transparent);
        }
        .ct-form-title {
          font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:2px;
          color:#fff; margin-bottom:.5rem;
        }
        .ct-form-sub { color:rgba(255,255,255,.35); font-size:.85rem; margin-bottom:2rem; line-height:1.5; }
        .ct-form { display:flex; flex-direction:column; gap:1.25rem; }
        .ct-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .ct-field label {
          display:block; font-size:.72rem; font-weight:600;
          letter-spacing:.5px; text-transform:uppercase;
          color:rgba(255,255,255,.35); margin-bottom:.5rem;
        }
        .ct-field input, .ct-field textarea, .ct-field select {
          width:100%;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          border-radius:10px; color:#fff;
          font-family:'DM Sans',sans-serif; font-size:.9rem;
          padding:.75rem 1rem; transition:all .2s;
        }
        .ct-field input:focus, .ct-field textarea:focus, .ct-field select:focus {
          outline:none; border-color:rgba(255,69,0,.5);
          background:rgba(255,69,0,.04); box-shadow:0 0 0 3px rgba(255,69,0,.08);
        }
        .ct-field input::placeholder, .ct-field textarea::placeholder { color:rgba(255,255,255,.2); }
        .ct-field textarea { resize:vertical; min-height:120px; line-height:1.6; }
        .ct-field select { cursor:pointer; appearance:none; }
        .ct-field select option { background:#111; color:#fff; }
        .ct-submit {
          background:#FF4500; color:#fff; border:none;
          padding:1rem; border-radius:11px;
          font-family:'DM Sans',sans-serif; font-size:.875rem;
          font-weight:700; letter-spacing:.75px; text-transform:uppercase;
          cursor:pointer; transition:all .25s;
          display:flex; align-items:center; justify-content:center; gap:.6rem;
        }
        .ct-submit:hover:not(:disabled) {
          background:#e03d00; transform:translateY(-2px);
          box-shadow:0 12px 28px rgba(255,69,0,.35);
        }
        .ct-submit:disabled { background:#2a2a2a; color:rgba(255,255,255,.3); cursor:not-allowed; }
        .ct-err { color:#ff6b6b; font-size:.72rem; margin-top:3px; display:block; }

        @media(max-width:900px){
          .ct-body { grid-template-columns:1fr; }
          .ct-row { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="contact-root">
        {/* Head */}
        <div className="ct-head">
          <div className="ct-eyebrow">Contáctanos</div>
          <h1 className="ct-title">HABLEMOS</h1>
          <p className="ct-subtitle">¿Tienes preguntas sobre productos, pedidos o quieres ser parte del equipo? Estamos aquí.</p>
        </div>

        <div className="ct-body">
          {/* Info */}
          <div className="ct-info">
            {contactInfo.map(c => (
              <div key={c.label} className="ct-info-card">
                <div className="ct-info-icon">{c.icon}</div>
                <div>
                  <p className="ct-info-label">{c.label}</p>
                  <p className="ct-info-val">{c.value}</p>
                </div>
              </div>
            ))}

            <div style={{marginTop:'.5rem'}}>
              <p className="ct-social-head">Síguenos</p>
              <div className="ct-socials">
                {/* Instagram */}
                <a href="#" className="ct-social-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" strokeWidth="2"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="#" className="ct-social-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                {/* Twitter/X */}
                <a href="#" className="ct-social-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="ct-form-card">
            <h2 className="ct-form-title">Envíanos un mensaje</h2>
            <p className="ct-form-sub">Respuesta garantizada en menos de 24 horas hábiles.</p>

            <form className="ct-form" onSubmit={handleSubmit}>
              <div className="ct-row">
                <div className="ct-field">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Tu nombre" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ct-field">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="tu@email.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ct-field">
                <label>Asunto</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="pedido">Consulta sobre pedido</option>
                  <option value="producto">Información de producto</option>
                  <option value="devolucion">Devolución / Garantía</option>
                  <option value="mayorista">Ventas mayoristas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="ct-field">
                <label>Mensaje</label>
                <textarea 
                  name="message" 
                  placeholder="Escribe tu mensaje..." 
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div style={{ 
                  background: 'rgba(255,107,107,0.1)', 
                  border: '1px solid rgba(255,107,107,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#ff6b6b',
                  fontSize: '0.85rem'
                }}>
                  {error}
                </div>
              )}

              <button type="submit" className="ct-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{animation:'spin 1s linear infinite'}}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12"/>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </>
  )
}

export default Contact