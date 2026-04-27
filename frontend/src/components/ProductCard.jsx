const ProductCard = ({ product, addToCart, viewProductDetail, user, onShowAuth }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation()
    // En lugar de agregar directamente, ir a la página de detalle
    viewProductDetail(product)
  }
  
  const handleLoginRequired = (e) => {
    e.stopPropagation()
    onShowAuth()
  }

  return (
    <>
      <style>{`
        .p-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }
        .p-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #FF4500, #ff6a35);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          z-index: 2;
        }
        .p-card:hover {
          border-color: rgba(255,69,0,0.25);
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,69,0,0.1);
        }
        .p-card:hover::before { transform: scaleX(1); }

        .p-img-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: linear-gradient(135deg, #161616, #1a1a1a);
        }
        .p-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .p-card:hover .p-img-wrap img {
          transform: scale(1.08) rotate(1deg);
        }
        .p-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #FF4500;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 50px;
          z-index: 1;
        }
        .p-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
        }

        .p-body {
          padding: 1.4rem;
        }
        .p-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 1px;
          color: #fff;
          margin: 0 0 4px;
          line-height: 1.1;
        }
        .p-cat {
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FF4500;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        .p-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }
        .p-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.7rem;
          color: #fff;
          letter-spacing: 1px;
        }
        .p-price span {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-cart {
          flex: 1;
          background: #FF4500;
          color: #fff;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-transform: uppercase;
        }
        .btn-cart:hover {
          background: #e03d00;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255,69,0,0.35);
        }
        .btn-login-req {
          flex: 1;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-transform: uppercase;
        }
        .btn-login-req:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }
      `}</style>

      <div className="p-card" onClick={() => viewProductDetail(product)}>
        <div className="p-img-wrap">
          <img src={product.image} alt={product.name} />
          <div className="p-overlay" />
          {product.badge && <span className="p-badge">{product.badge}</span>}
        </div>

        <div className="p-body">
          <h3 className="p-name">{product.name}</h3>
          <p className="p-cat">{product.category}</p>

          <div className="p-footer">
            <div className="p-price">
              <span>S/ </span>{product.price}
            </div>

            {user ? (
              <button className="btn-cart" onClick={handleAddToCart}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Agregar
              </button>
            ) : (
              <button className="btn-login-req" onClick={handleLoginRequired}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard