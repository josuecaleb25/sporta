import { useState, useEffect, useRef } from 'react'

const Hero = () => {
  const [currentModel, setCurrentModel] = useState(0)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const carouselRef = useRef(null)

  const models = [
    { id: 1, name: "Air Sprint Pro", category: "Running", image: "/src/assets/modelo1.png" },
    { id: 2, name: "Urban Pulse", category: "Lifestyle", image: "/src/assets/modelo2.png" },
    { id: 3, name: "Classic Strike", category: "Originals", image: "/src/assets/modelo3.png" },
    { id: 4, name: "Court Force", category: "Basketball", image: "/src/assets/modelo4.png" },
    { id: 5, name: "Retro Blaze", category: "Retro", image: "/src/assets/modelo5.png" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModel(prev => (prev + 1) % models.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [models.length])

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current
      const active = container.children[currentModel]
      if (active) {
        const scrollLeft = active.offsetLeft - container.offsetWidth / 2 + active.offsetWidth / 2
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [currentModel])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hero-root {
          min-height: 100vh;
          background: #080808;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Fondo decorativo */
        .hero-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .orb1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,69,0,0.12) 0%, transparent 70%);
          top: -200px; right: -100px;
        }
        .orb2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,69,0,0.07) 0%, transparent 70%);
          bottom: -150px; left: -100px;
        }
        .hero-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        /* Layout */
        .hero-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 5rem 2rem;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* Contenido izquierda */
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.1s forwards;
        }
        .hero-eyebrow-line {
          width: 32px;
          height: 2px;
          background: #FF4500;
        }
        .hero-eyebrow span {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #FF4500;
        }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 8vw, 7rem);
          line-height: 0.92;
          color: #fff;
          letter-spacing: 2px;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.2s forwards;
        }
        .hero-title .accent {
          color: #FF4500;
          display: block;
        }
        .hero-title .outline {
          -webkit-text-stroke: 1px rgba(255,255,255,0.25);
          color: transparent;
          display: block;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 440px;
          font-weight: 300;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.35s forwards;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.5s forwards;
          margin-top: 0.5rem;
        }
        .btn-primary {
          background: #FF4500;
          color: #fff;
          border: none;
          padding: 0.9rem 2.2rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }
        .btn-primary:hover {
          background: #e03d00;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255,69,0,0.4);
        }
        .btn-secondary {
          background: none;
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.9rem 2rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }
        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.65s forwards;
        }
        .hero-tag {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 0.35rem 0.9rem;
          border-radius: 50px;
          text-transform: uppercase;
        }

        /* Carrusel derecha */
        .hero-carousel-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
          animation: fadeIn 0.8s ease 0.4s forwards;
        }
        .carousel-track {
          display: flex;
          gap: 1.25rem;
          overflow-x: hidden;
          width: 100%;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          cursor: grab;
          padding: 1rem 0;
        }
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-card {
          flex: 0 0 auto;
          width: 220px;
          scroll-snap-align: center;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          transition: all 0.35s ease;
          cursor: pointer;
          transform: scale(0.88);
          opacity: 0.45;
        }
        .carousel-card.active {
          transform: scale(1);
          opacity: 1;
          border-color: rgba(255,69,0,0.35);
          box-shadow: 0 0 40px rgba(255,69,0,0.15), 0 20px 40px rgba(0,0,0,0.4);
        }
        .carousel-card:hover {
          opacity: 0.8;
          transform: scale(0.93);
        }
        .carousel-card.active:hover {
          transform: scale(1.02);
        }
        .carousel-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
        }
        .carousel-info {
          padding: 1rem 1.1rem;
        }
        .carousel-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 1.5px;
          color: #fff;
          margin: 0 0 2px;
        }
        .carousel-cat {
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FF4500;
          font-weight: 500;
        }

        /* Indicadores */
        .carousel-dots {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }
        .dot.active {
          background: #FF4500;
          width: 20px;
          border-radius: 3px;
        }

        /* Animaciones */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* VIDEO MODAL */
        .video-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }
        .video-modal-content {
          position: relative;
          width: 100%;
          max-width: 1100px;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .video-modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255, 69, 0, 0.05), transparent);
        }
        .video-modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 2px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .video-modal-title svg {
          color: #FF4500;
        }
        .video-modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .video-modal-close:hover {
          background: rgba(255, 69, 0, 0.15);
          border-color: rgba(255, 69, 0, 0.3);
          color: #FF4500;
          transform: rotate(90deg);
        }
        .video-modal-body {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          background: #000;
        }
        .video-modal-body video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 3rem 1.5rem;
          }
          .hero-eyebrow { justify-content: center; }
          .hero-subtitle { margin: 0 auto; }
          .hero-cta-group { justify-content: center; flex-wrap: wrap; }
          .hero-tags { justify-content: center; }
          .carousel-track { justify-content: flex-start; }
          .video-modal-content { max-width: 95%; }
        }
      `}</style>

      <section className="hero-root">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <div className="hero-grid-lines" />

        <div className="hero-inner">
          {/* IZQUIERDA — Contenido */}
          <div className="hero-content">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span>Nueva Colección 2026</span>
            </div>

            <h1 className="hero-title">
              ELEVA<br/>
              <span className="accent">TU JUEGO</span>
              <span className="outline">SPORTA</span>
            </h1>

            <p className="hero-subtitle">
              Equipamiento deportivo de alto rendimiento diseñado para atletas que no aceptan límites. Tecnología, estilo y precisión en cada detalle.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary">Ver Colección</button>
              <button className="btn-secondary" onClick={() => setShowVideoModal(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                </svg>
                Ver Spot Publicitario
              </button>
            </div>

            <div className="hero-tags">
              {['Envío Gratis +S/150', 'Garantía 2 años', 'Devolución 30 días'].map(t => (
                <span key={t} className="hero-tag">{t}</span>
              ))}
            </div>
          </div>

          {/* DERECHA — Carrusel */}
          <div className="hero-carousel-wrapper">
            <div className="carousel-track" ref={carouselRef}>
              {models.map((m, i) => (
                <div
                  key={m.id}
                  className={`carousel-card ${i === currentModel ? 'active' : ''}`}
                  onClick={() => setCurrentModel(i)}
                >
                  <img src={m.image} alt={m.name} className="carousel-img" />
                  <div className="carousel-info">
                    <p className="carousel-name">{m.name}</p>
                    <p className="carousel-cat">{m.category}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-dots">
              {models.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentModel ? 'active' : ''}`}
                  onClick={() => setCurrentModel(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowVideoModal(false)}>
          <div className="video-modal-content">
            <div className="video-modal-header">
              <div className="video-modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                </svg>
                SPOT PUBLICITARIO SPORTA
              </div>
              <button className="video-modal-close" onClick={() => setShowVideoModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="video-modal-body">
              <video controls autoPlay>
                <source src="/SportaVideoPublicitario.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Hero