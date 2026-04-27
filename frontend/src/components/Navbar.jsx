import { useState } from 'react'

const Navbar = ({
  currentPage,
  setCurrentPage,
  cartItemsCount,
  setShowCart,
  user,
  onLogout,
  setShowAuth
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Inicio', page: 'home' },
    { label: 'Productos', page: 'products' },
    { label: 'Nosotros', page: 'about' },
    { label: 'Contacto', page: 'contact' },
  ]

  return (
    <>
      <style>{`
        .sporta-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(8, 8, 8, 0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
        }
        .nav-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-logo img {
          height: 38px;
          width: auto;
          filter: invert(1);
        }
        .nav-logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.7rem;
          color: #fff;
          letter-spacing: 3px;
          line-height: 1;
        }
        .nav-logo-text span {
          color: #FF4500;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-links button:hover,
        .nav-links button.active {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }
        .nav-links button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: #FF4500;
          border-radius: 2px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-btn-icon {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-btn-icon:hover {
          background: rgba(255,69,0,0.15);
          border-color: rgba(255,69,0,0.4);
          color: #FF4500;
        }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #FF4500;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #080808;
        }
        .nav-btn-login {
          background: #FF4500;
          border: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 0.5rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-btn-login:hover {
          background: #e03d00;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,69,0,0.35);
        }
        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.4rem 0.9rem 0.4rem 0.5rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #FF4500, #ff6a35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.5rem;
          min-width: 160px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px);
          transition: all 0.2s ease;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .user-pill:hover .user-dropdown,
        .user-pill:focus-within .user-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .logout-btn {
          width: 100%;
          background: rgba(255,69,0,0.12);
          border: 1px solid rgba(255,69,0,0.25);
          color: #FF4500;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .logout-btn:hover {
          background: rgba(255,69,0,0.2);
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-inner { padding: 0 1rem; }
        }
      `}</style>

      <nav className="sporta-nav">
        <div className="nav-inner">
          {/* Logo */}
          <div className="nav-logo" onClick={() => setCurrentPage('home')}>
            <img src="/src/assets/Sporta_BLACK-logo.png" alt="Sporta" />
            <span className="nav-logo-text">SPORT<span>A</span></span>
          </div>

          {/* Links */}
          <ul className="nav-links">
            {navLinks.map(({ label, page }) => (
              <li key={page}>
                <button
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Acciones */}
          <div className="nav-actions">
            {/* Carrito */}
            <button className="nav-btn-icon" onClick={() => setShowCart(true)} title="Carrito">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            {/* Usuario */}
            {user ? (
              <div className="user-pill" tabIndex={0}>
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.name}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{opacity:0.5}}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="user-dropdown">
                  <button className="logout-btn" onClick={onLogout}>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <button className="nav-btn-login" onClick={() => setShowAuth(true)}>
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar