import { useState, useEffect } from 'react'
import { api } from '../api'

const Home = ({ onNavigate, user, onShowAuth }) => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const res = await api.getProducts()
      if (res.products) {
        // Tomar los primeros 3 productos destacados o los primeros 3
        const featuredProducts = res.products
          .filter(p => p.is_featured)
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            badge: p.badge || 'Nuevo',
            emoji: p.category === 'running' ? '👟' : p.category === 'basketball' ? '🏀' : '🔥'
          }))
        
        // Si no hay productos destacados, tomar los primeros 3
        if (featuredProducts.length === 0) {
          const firstThree = res.products.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            badge: p.badge || 'Nuevo',
            emoji: p.category === 'running' ? '👟' : p.category === 'basketball' ? '🏀' : '🔥'
          }))
          setFeatured(firstThree)
        } else {
          setFeatured(featuredProducts)
        }
      }
    } catch (err) {
      console.error('Error cargando productos destacados:', err)
      // Fallback a productos por defecto si falla
      setFeatured([
        { id: 1, name: 'Air Sprint Pro', price: 449.99, badge: 'Nuevo', emoji: '👟' },
        { id: 2, name: 'Urban Pulse NMD', price: 399.99, badge: 'Popular', emoji: '🔥' },
        { id: 3, name: 'ZX Boost Radical', price: 419.99, badge: 'Boost', emoji: '⚡' },
      ])
    }
    setLoading(false)
  }

  const stats = [
    { value: '6+',   label: 'Modelos exclusivos' },
    { value: '500+', label: 'Clientes satisfechos' },
    { value: '2-3',  label: 'Días de entrega' },
    { value: '100%', label: 'Original garantizado' },
  ]

  const perks = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Envío rápido',
      desc: 'Entrega en 2-3 días hábiles a todo Lima',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: '100% Original',
      desc: 'Productos certificados con garantía oficial',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Devoluciones',
      desc: '30 días para cambios sin preguntas',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Soporte 24/7',
      desc: 'Atención por WhatsApp y correo electrónico',
    },
  ]

  return (
    <>
      <style>{`
        .home-root {
          background: #080808;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        /* ── HERO ── */
        .hm-hero {
          min-height: 92vh;
          display: flex; align-items: center;
          padding: 6rem 2rem 4rem;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(255,255,255,.06);
          position: relative; overflow: hidden;
        }
        .hm-hero::before {
          content: ''; position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(255,69,0,.11) 0%, transparent 65%);
          top: -200px; right: -150px; pointer-events: none;
        }
        .hm-hero::after {
          content: ''; position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,69,0,.06) 0%, transparent 70%);
          bottom: -100px; left: -100px; pointer-events: none;
        }
        .hm-hero-inner {
          max-width: 1200px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
          position: relative; z-index: 1;
        }
        .hm-eyebrow {
          display: inline-flex; align-items: center; gap: .5rem;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 50px; padding: .3rem .9rem;
          font-size: .7rem; letter-spacing: 2px; text-transform: uppercase;
          color: #FF4500; font-weight: 600; margin-bottom: 1.5rem;
        }
        .hm-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 7vw, 6rem);
          letter-spacing: 2px; line-height: .9;
          margin-bottom: 1.5rem;
        }
        .hm-title span { color: #FF4500; }
        .hm-desc {
          color: rgba(255,255,255,.4); font-size: 1rem;
          line-height: 1.75; max-width: 460px; margin-bottom: 2.5rem;
        }
        .hm-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hm-btn-primary {
          background: #FF4500; color: #fff; border: none;
          padding: .9rem 2rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: .875rem;
          font-weight: 700; letter-spacing: .75px; text-transform: uppercase;
          cursor: pointer; transition: all .25s;
          display: flex; align-items: center; gap: .5rem;
        }
        .hm-btn-primary:hover {
          background: #e03d00; transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255,69,0,.35);
        }
        .hm-btn-ghost {
          background: transparent; color: rgba(255,255,255,.6);
          border: 1px solid rgba(255,255,255,.15);
          padding: .9rem 2rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: .875rem;
          font-weight: 600; letter-spacing: .5px;
          cursor: pointer; transition: all .2s;
        }
        .hm-btn-ghost:hover {
          border-color: rgba(255,255,255,.35); color: #fff;
        }

        /* Hero visual side */
        .hm-hero-visual {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 24px; padding: 2.5rem;
          position: relative; overflow: hidden;
        }
        .hm-hero-visual::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #FF4500, transparent);
        }
        .hm-hero-badge {
          display: inline-flex; align-items: center; gap: .4rem;
          background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.2);
          border-radius: 50px; padding: .25rem .8rem;
          font-size: .7rem; letter-spacing: 1px; color: #4ade80;
          font-weight: 600; text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .hm-hero-visual h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 1.5rem;
        }
        .hm-feat-list { display: flex; flex-direction: column; gap: .9rem; }
        .hm-feat-item {
          display: flex; align-items: center; gap: .85rem;
          padding: .85rem 1rem;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px; transition: border-color .2s;
        }
        .hm-feat-item:hover { border-color: rgba(255,69,0,.2); }
        .hm-feat-emoji { font-size: 1.4rem; }
        .hm-feat-name { font-weight: 600; font-size: .9rem; color: #fff; margin-bottom: 1px; }
        .hm-feat-price { font-size: .8rem; color: #FF4500; font-weight: 600; }
        .hm-feat-badge {
          margin-left: auto;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 6px; padding: .2rem .6rem;
          font-size: .65rem; letter-spacing: 1px; color: #FF4500;
          font-weight: 700; text-transform: uppercase;
        }

        /* ── STATS ── */
        .hm-stats {
          max-width: 900px; margin: 0 auto;
          padding: 4rem 2rem;
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem;
        }
        .hm-stat {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; padding: 1.75rem 1rem;
          text-align: center; transition: border-color .2s;
        }
        .hm-stat:hover { border-color: rgba(255,69,0,.25); }
        .hm-stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem; letter-spacing: 1px; color: #FF4500;
        }
        .hm-stat-label { color: rgba(255,255,255,.3); font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; margin-top: .2rem; }

        /* ── LAUNCHES ── */
        .hm-launches-wrap { padding: 0 2rem 5rem; }
        .hm-launches-inner { max-width: 1200px; margin: 0 auto; }
        .hm-section-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
        }
        .hm-section-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: 2px;
        }
        .hm-section-head h2 span { color: #FF4500; }
        .hm-see-all {
          background: transparent; border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.5); font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 500; padding: .5rem 1.25rem;
          border-radius: 8px; cursor: pointer; transition: all .2s;
        }
        .hm-see-all:hover { color: #fff; border-color: rgba(255,255,255,.3); }
        .hm-cards {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem;
        }
        .hm-card {
          background: #111; border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; overflow: hidden;
          transition: all .25s; cursor: pointer;
        }
        .hm-card:hover { border-color: rgba(255,69,0,.3); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,.4); }
        .hm-card-img {
          height: 200px; background: rgba(255,255,255,.03);
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem; position: relative;
        }
        .hm-card-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: #FF4500; color: #fff;
          font-size: .65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          padding: .25rem .6rem; border-radius: 6px;
        }
        .hm-card-body { padding: 1.25rem 1.5rem 1.5rem; }
        .hm-card-body h3 { font-size: 1rem; font-weight: 600; margin-bottom: .35rem; }
        .hm-card-body p { color: rgba(255,255,255,.3); font-size: .8rem; margin-bottom: 1rem; }
        .hm-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .hm-card-price { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 1px; color: #FF4500; }
        .hm-card-btn {
          background: rgba(255,69,0,.15); border: 1px solid rgba(255,69,0,.25);
          color: #FF4500; font-family: 'DM Sans', sans-serif;
          font-size: .78rem; font-weight: 700; padding: .45rem 1rem;
          border-radius: 8px; cursor: pointer; transition: all .2s;
        }
        .hm-card-btn:hover { background: #FF4500; color: #fff; }

        /* ── PERKS ── */
        .hm-perks-wrap {
          background: #0d0d0d; border-top: 1px solid rgba(255,255,255,.06);
          padding: 5rem 2rem;
        }
        .hm-perks-inner { max-width: 1100px; margin: 0 auto; }
        .hm-perks-head { text-align: center; margin-bottom: 3rem; }
        .hm-perks-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem); letter-spacing: 2px;
        }
        .hm-perks-head h2 span { color: #FF4500; }
        .hm-perks-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem;
        }
        .hm-perk {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; padding: 1.75rem 1.5rem; transition: all .2s;
        }
        .hm-perk:hover { border-color: rgba(255,69,0,.25); transform: translateY(-2px); }
        .hm-perk-icon {
          width: 44px; height: 44px;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 11px; display: flex; align-items: center; justify-content: center;
          color: #FF4500; margin-bottom: 1rem;
        }
        .hm-perk h3 { font-size: .95rem; font-weight: 600; margin-bottom: .4rem; }
        .hm-perk p { color: rgba(255,255,255,.35); font-size: .82rem; line-height: 1.55; }

        /* ── CTA BANNER ── */
        .hm-cta {
          max-width: 700px; margin: 0 auto;
          padding: 5rem 2rem; text-align: center;
        }
        .hm-cta h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: 2px;
          line-height: .95; margin-bottom: 1rem;
        }
        .hm-cta h2 span { color: #FF4500; }
        .hm-cta p { color: rgba(255,255,255,.35); font-size: .95rem; line-height: 1.7; margin-bottom: 2rem; }
        .hm-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        @media(max-width:960px) {
          .hm-hero-inner { grid-template-columns: 1fr; }
          .hm-hero-visual { display: none; }
          .hm-stats { grid-template-columns: repeat(2,1fr); }
          .hm-cards { grid-template-columns: repeat(2,1fr); }
          .hm-perks-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media(max-width:540px) {
          .hm-cards { grid-template-columns: 1fr; }
          .hm-perks-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home-root">

        {/* HERO */}
        <div className="hm-hero">
          <div className="hm-hero-inner">
            <div>
              <div className="hm-eyebrow">⚡ Colección 2025</div>
              <h1 className="hm-title">
                VISTE<br/>TU<br/><span>MEJOR</span><br/>VERSIÓN
              </h1>
              <p className="hm-desc">
                Equipamiento deportivo premium diseñado para atletas que no aceptan límites. 
                Envíos rápidos a todo Lima.
              </p>
              <div className="hm-actions">
                <button className="hm-btn-primary" onClick={() => onNavigate ? onNavigate('products') : null}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ver colección
                </button>
                {!user && (
                  <button className="hm-btn-ghost" onClick={onShowAuth}>
                    Crear cuenta gratis
                  </button>
                )}
              </div>
            </div>

            <div className="hm-hero-visual">
              <div className="hm-hero-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                Nuevos lanzamientos
              </div>
              <h3>DESTACADOS DE LA SEMANA</h3>
              <div className="hm-feat-list">
                {featured.map(p => (
                  <div key={p.id} className="hm-feat-item">
                    <span className="hm-feat-emoji">{p.emoji}</span>
                    <div>
                      <div className="hm-feat-name">{p.name}</div>
                      <div className="hm-feat-price">S/ {p.price}</div>
                    </div>
                    <span className="hm-feat-badge">{p.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="hm-stats">
          {stats.map(s => (
            <div key={s.label} className="hm-stat">
              <div className="hm-stat-val">{s.value}</div>
              <div className="hm-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* LAUNCHES */}
        <div className="hm-launches-wrap">
          <div className="hm-launches-inner">
            <div className="hm-section-head">
              <h2>NUEVOS <span>LANZAMIENTOS</span></h2>
              <button className="hm-see-all" onClick={() => onNavigate ? onNavigate('products') : null}>
                Ver todos →
              </button>
            </div>
            <div className="hm-cards">
              {featured.map(p => (
                <div key={p.id} className="hm-card" onClick={() => onNavigate ? onNavigate('products') : null}>
                  <div className="hm-card-img">
                    {p.emoji}
                    <span className="hm-card-badge">{p.badge}</span>
                  </div>
                  <div className="hm-card-body">
                    <h3>{p.name}</h3>
                    <p>Rendimiento · Estilo · Comodidad</p>
                    <div className="hm-card-footer">
                      <span className="hm-card-price">S/ {p.price}</span>
                      <button className="hm-card-btn">Ver más</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERKS */}
        <div className="hm-perks-wrap">
          <div className="hm-perks-inner">
            <div className="hm-perks-head">
              <h2>¿POR QUÉ <span>SPORTA?</span></h2>
            </div>
            <div className="hm-perks-grid">
              {perks.map(p => (
                <div key={p.title} className="hm-perk">
                  <div className="hm-perk-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hm-cta">
          <h2>READY TO <span>RUN?</span></h2>
          <p>Únete a cientos de atletas en Lima que ya eligieron equipamiento de nivel mundial.</p>
          <div className="hm-cta-actions">
            <button className="hm-btn-primary" onClick={() => onNavigate ? onNavigate('products') : null}>
              Explorar productos
            </button>
            {!user && (
              <button className="hm-btn-ghost" onClick={onShowAuth}>
                Registrarme
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export default Home