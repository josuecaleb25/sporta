const Footer = () => {
  return (
    <>
      <style>{`
        .footer-root {
          background: #080808;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 4rem 2rem 2rem;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF4500, transparent);
          opacity: 0.5;
        }
        .footer-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
        }
        .footer-brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 4px;
          color: #fff;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-brand-name img {
          height: 32px;
          filter: invert(1);
        }
        .footer-brand-name span { color: #FF4500; }
        .footer-tagline {
          color: rgba(255,255,255,0.35);
          font-size: 0.85rem;
          line-height: 1.6;
          max-width: 240px;
        }
        .footer-col-title {
          font-size: 0.7rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .footer-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }
        .footer-links a:hover { color: #FF4500; }
        .footer-bottom {
          max-width: 1100px;
          margin: 3rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .footer-copy {
          color: rgba(255,255,255,0.2);
          font-size: 0.78rem;
        }
        .footer-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #FF4500;
          display: inline-block;
          margin: 0 6px;
          vertical-align: middle;
          opacity: 0.5;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { justify-content: center; text-align: center; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              <img src="/src/assets/Sporta_BLACK-logo.png" alt="Sporta" />
              SPORT<span>A</span>
            </div>
            <p className="footer-tagline">
              Equipamiento deportivo de alto rendimiento. Diseñado para atletas que no aceptan límites.
            </p>
          </div>

          <div>
            <p className="footer-col-title">Tienda</p>
            <ul className="footer-links">
              <li><a href="#">Productos</a></li>
              <li><a href="#">Novedades</a></li>
              <li><a href="#">Ofertas</a></li>
              <li><a href="#">Colecciones</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Empresa</p>
            <ul className="footer-links">
              <li><a href="#">Nosotros</a></li>
              <li><a href="#">Carreras</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Soporte</p>
            <ul className="footer-links">
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Devoluciones</a></li>
              <li><a href="#">Tallas</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2025 Sporta<span className="footer-dot" />Todos los derechos reservados
          </p>
          <p className="footer-copy">
            Lima, Perú<span className="footer-dot" />info@sporta.pe
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer