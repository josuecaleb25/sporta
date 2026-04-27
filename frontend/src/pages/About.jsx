const About = () => {
  const stats = [
    { value: '75+', label: 'Años de historia' },
    { value: '160+', label: 'Países presentes' },
    { value: '60K+', label: 'Empleados globales' },
    { value: '#1', label: 'Marca deportiva Europa' },
  ]

  const values = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Innovación',
      desc: 'Tecnología de vanguardia en cada producto para llevar tu rendimiento al siguiente nivel.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Calidad',
      desc: 'Materiales premium seleccionados para garantizar durabilidad y confort en cada uso.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Legado',
      desc: 'Más de 75 años vistiendo a los mejores atletas del mundo en cada disciplina deportiva.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Comunidad',
      desc: 'Conectamos atletas, creadores y equipos en todo el mundo bajo una misma pasión.',
    },
  ]

  const timeline = [
    { year: '1949', event: 'Fundación por Adolf Dassler en Herzogenaurach, Alemania.' },
    { year: '1954', event: 'Alemania gana el Mundial con botas Adidas. El mundo nos conoce.' },
    { year: '1972', event: 'Debut del icónico logo de las tres rayas en los JJ.OO. de Múnich.' },
    { year: '1995', event: 'Adidas se convierte en empresa pública en la bolsa de Fráncfort.' },
    { year: '2015', event: 'Lanzamiento de Boost™, la tecnología de amortiguación más avanzada.' },
    { year: '2024', event: 'Líder global en sostenibilidad deportiva con materiales reciclados.' },
  ]

  return (
    <>
      <style>{`
        .about-root {
          background: #080808;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        /* HERO */
        .ab-hero {
          padding: 6rem 2rem 4rem;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(255,255,255,.06);
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .ab-hero::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,69,0,.08) 0%, transparent 70%);
          top: -200px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }
        .ab-eyebrow {
          display: inline-flex; align-items: center; gap: .5rem;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 50px; padding: .3rem .9rem;
          font-size: .7rem; letter-spacing: 2px; text-transform: uppercase;
          color: #FF4500; font-weight: 600; margin-bottom: 1.25rem;
        }
        .ab-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          letter-spacing: 2px; line-height: .95;
          margin-bottom: 1.25rem;
        }
        .ab-title span { color: #FF4500; }
        .ab-subtitle {
          color: rgba(255,255,255,.4); font-size: 1rem;
          max-width: 520px; margin: 0 auto; line-height: 1.7; font-weight: 300;
        }

        /* STATS */
        .ab-stats {
          max-width: 900px; margin: 0 auto;
          padding: 4rem 2rem;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
        }
        .ab-stat {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; padding: 1.75rem 1rem;
          text-align: center; transition: border-color .2s;
        }
        .ab-stat:hover { border-color: rgba(255,69,0,.25); }
        .ab-stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem; letter-spacing: 1px; color: #FF4500;
          margin-bottom: .25rem;
        }
        .ab-stat-label { color: rgba(255,255,255,.35); font-size: .78rem; text-transform: uppercase; letter-spacing: 1px; }

        /* STORY */
        .ab-story {
          max-width: 1100px; margin: 0 auto;
          padding: 0 2rem 5rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
        }
        .ab-story-text h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem); letter-spacing: 2px;
          margin-bottom: 1.25rem;
        }
        .ab-story-text h2 span { color: #FF4500; }
        .ab-story-text p {
          color: rgba(255,255,255,.45); font-size: .95rem; line-height: 1.8;
          margin-bottom: 1rem;
        }
        .ab-story-visual {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; padding: 2.5rem;
          position: relative; overflow: hidden;
        }
        .ab-story-visual::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #FF4500, transparent);
        }
        .ab-story-visual h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem; letter-spacing: 2px; color: rgba(255,255,255,.5);
          margin-bottom: 1.5rem;
        }
        .ab-timeline { display: flex; flex-direction: column; gap: 1.25rem; }
        .ab-tl-item { display: flex; gap: 1rem; align-items: flex-start; }
        .ab-tl-year {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem; letter-spacing: 1px; color: #FF4500;
          min-width: 42px; padding-top: 1px;
        }
        .ab-tl-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,69,0,.4); border: 1px solid #FF4500;
          margin-top: 5px; flex-shrink: 0;
        }
        .ab-tl-event { color: rgba(255,255,255,.45); font-size: .85rem; line-height: 1.5; }

        /* VALUES */
        .ab-values-wrap {
          background: #0d0d0d; border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 5rem 2rem;
        }
        .ab-values-inner { max-width: 1100px; margin: 0 auto; }
        .ab-values-head { text-align: center; margin-bottom: 3rem; }
        .ab-values-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem); letter-spacing: 2px;
        }
        .ab-values-head h2 span { color: #FF4500; }
        .ab-values-head p { color: rgba(255,255,255,.35); font-size: .9rem; margin-top: .5rem; }
        .ab-values-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
        }
        .ab-val-card {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; padding: 1.75rem 1.5rem;
          transition: all .2s;
        }
        .ab-val-card:hover {
          border-color: rgba(255,69,0,.3);
          background: rgba(255,69,0,.04);
          transform: translateY(-3px);
        }
        .ab-val-icon {
          width: 46px; height: 46px;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          color: #FF4500; margin-bottom: 1.25rem;
        }
        .ab-val-card h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.15rem; letter-spacing: 1.5px; color: #fff; margin-bottom: .6rem;
        }
        .ab-val-card p { color: rgba(255,255,255,.35); font-size: .85rem; line-height: 1.6; }

        /* LOCATION */
        .ab-location {
          max-width: 1100px; margin: 0 auto;
          padding: 5rem 2rem;
        }
        .ab-location-head { text-align: center; margin-bottom: 3rem; }
        .ab-location-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem); letter-spacing: 2px;
        }
        .ab-location-head h2 span { color: #FF4500; }
        .ab-location-head p { color: rgba(255,255,255,.35); font-size: .9rem; margin-top: .5rem; }
        .ab-location-content {
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; align-items: center;
        }
        .ab-location-info {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; padding: 2.5rem;
          position: relative; overflow: hidden;
        }
        .ab-location-info::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #FF4500, transparent);
        }
        .ab-location-item {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .ab-location-item:last-child { border-bottom: none; }
        .ab-location-icon {
          width: 40px; height: 40px;
          background: rgba(255,69,0,.1); border: 1px solid rgba(255,69,0,.2);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: #FF4500; flex-shrink: 0;
        }
        .ab-location-label {
          font-size: .7rem; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,.3); font-weight: 600; margin-bottom: .25rem;
        }
        .ab-location-value {
          color: #fff; font-size: .95rem; line-height: 1.6;
        }
        .ab-map-container {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; overflow: hidden; position: relative;
          height: 400px;
        }
        .ab-map-container::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #FF4500, transparent); z-index: 1;
        }
        .ab-map-container iframe {
          width: 100%; height: 100%; border: 0; display: block;
        }

        /* CTA */
        .ab-cta {
          max-width: 600px; margin: 0 auto; padding: 5rem 2rem;
          text-align: center;
        }
        .ab-cta h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: 2px;
          margin-bottom: .75rem;
        }
        .ab-cta h2 span { color: #FF4500; }
        .ab-cta p { color: rgba(255,255,255,.35); font-size: .95rem; line-height: 1.7; margin-bottom: 2rem; }
        .ab-cta-btn {
          background: #FF4500; color: #fff; border: none;
          padding: .9rem 2.5rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: .875rem;
          font-weight: 700; letter-spacing: .75px; text-transform: uppercase;
          cursor: pointer; transition: all .25s;
        }
        .ab-cta-btn:hover {
          background: #e03d00; transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255,69,0,.35);
        }

        @media(max-width:900px) {
          .ab-stats { grid-template-columns: repeat(2,1fr); }
          .ab-story { grid-template-columns: 1fr; gap: 2rem; }
          .ab-values-grid { grid-template-columns: repeat(2,1fr); }
          .ab-location-content { grid-template-columns: 1fr; }
          .ab-map-container { height: 350px; }
        }
        @media(max-width:540px) {
          .ab-stats { grid-template-columns: repeat(2,1fr); }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-map-container { height: 300px; }
        }
      `}</style>

      <div className="about-root">
        {/* Hero */}
        <div className="ab-hero">
          <div className="ab-eyebrow">Nuestra historia</div>
          <h1 className="ab-title">SOBRE <span>SPORTA</span></h1>
          <p className="ab-subtitle">
            Más de 75 años creando equipamiento que impulsa a atletas a romper sus propios límites. 
            Esto es lo que somos.
          </p>
        </div>

        {/* Stats */}
        <div className="ab-stats">
          {stats.map(s => (
            <div key={s.label} className="ab-stat">
              <div className="ab-stat-val">{s.value}</div>
              <div className="ab-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="ab-story">
          <div className="ab-story-text">
            <h2>NUESTRA <span>MISIÓN</span></h2>
            <p>
              Somos una compañía deportiva fundada con una sola convicción: el deporte 
              tiene el poder de transformar vidas. Desde Herzogenaurach hasta Lima, 
              llevamos esa filosofía en cada producto que fabricamos.
            </p>
            <p>
              Nuestra misión es ser la marca deportiva líder en el mundo, ofreciendo 
              productos innovadores y de alta calidad para atletas y amantes del deporte 
              en cada rincón del planeta.
            </p>
            <p>
              En Perú, apostamos por acercar equipamiento de nivel mundial a cada atleta 
              local, con precios justos y entregas rápidas a todo Lima.
            </p>
          </div>

          <div className="ab-story-visual">
            <h3>LÍNEA DE TIEMPO</h3>
            <div className="ab-timeline">
              {timeline.map(t => (
                <div key={t.year} className="ab-tl-item">
                  <span className="ab-tl-year">{t.year}</span>
                  <div className="ab-tl-dot" />
                  <span className="ab-tl-event">{t.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="ab-values-wrap">
          <div className="ab-values-inner">
            <div className="ab-values-head">
              <h2>NUESTROS <span>VALORES</span></h2>
              <p>Los principios que guían cada decisión que tomamos</p>
            </div>
            <div className="ab-values-grid">
              {values.map(v => (
                <div key={v.title} className="ab-val-card">
                  <div className="ab-val-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="ab-location">
          <div className="ab-location-head">
            <h2>NOS UBICAMOS <span>AQUÍ</span></h2>
            <p>Visítanos en nuestra tienda física en Lima</p>
          </div>
          <div className="ab-location-content">
            <div className="ab-location-info">
              <div className="ab-location-item">
                <div className="ab-location-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="ab-location-label">Dirección</div>
                  <div className="ab-location-value">Av. Javier Prado Este 4200<br/>San Borja, Lima - Perú</div>
                </div>
              </div>
              <div className="ab-location-item">
                <div className="ab-location-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="ab-location-label">Horario</div>
                  <div className="ab-location-value">Lunes a Domingo<br/>10:00 AM - 9:00 PM</div>
                </div>
              </div>
              <div className="ab-location-item">
                <div className="ab-location-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="ab-location-label">Teléfono</div>
                  <div className="ab-location-value">+51 999 888 777</div>
                </div>
              </div>
              <div className="ab-location-item">
                <div className="ab-location-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="ab-location-label">Email</div>
                  <div className="ab-location-value">hola@sporta.pe</div>
                </div>
              </div>
            </div>
            <div className="ab-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9279.185604898666!2d-76.98207465029648!3d-12.083582483063067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7ad866d5fcb%3A0x56ddc453686c288b!2sadidas%20Store!5e0!3m2!1ses!2spe!4v1777042358453!5m2!1ses!2spe" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Sporta en Google Maps"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="ab-cta">
          <h2>ÚNETE AL <span>EQUIPO</span></h2>
          <p>Explora nuestra colección y forma parte de la comunidad de atletas que eligen rendimiento sin compromisos.</p>
          <button className="ab-cta-btn">Ver productos</button>
        </div>
      </div>
    </>
  )
}

export default About