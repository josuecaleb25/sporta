const Cart = ({
  cart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  setShowCart,
  onCheckout,
  user,
  onShowAuth
}) => {
  const handleCheckoutClick = () => {
    if (cart.length === 0) return
    if (!user) { setShowCart(false); onShowAuth(); return }
    onCheckout()
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 150 ? 0 : 15
  const total = subtotal + shipping

  return (
    <>
      <style>{`
        .cart-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn .25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-panel {
          width: 100%; max-width: 460px; height: 100%;
          background: #0e0e0e;
          border-left: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          animation: slideInRight .3s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }

        /* HEAD */
        .cart-head {
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .cart-head-left { display: flex; align-items: center; gap: .75rem; }
        .cart-head-icon {
          width: 36px; height: 36px;
          background: rgba(255,69,0,.12);
          border: 1px solid rgba(255,69,0,.25);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #FF4500;
        }
        .cart-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem; letter-spacing: 2px; color: #fff;
        }
        .cart-count-pill {
          background: #FF4500; color: #fff;
          font-size: .65rem; font-weight: 700;
          padding: .15rem .55rem; border-radius: 50px;
          letter-spacing: .5px;
        }
        .cart-close {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.5);
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s ease;
        }
        .cart-close:hover {
          background: rgba(255,69,0,.15);
          border-color: rgba(255,69,0,.3);
          color: #FF4500; transform: rotate(90deg);
        }

        /* EMPTY */
        .cart-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 3rem 2rem; text-align: center; gap: 1rem;
        }
        .cart-empty-icon {
          width: 80px; height: 80px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.2);
        }
        .cart-empty h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem; letter-spacing: 2px; color: #fff;
        }
        .cart-empty p { font-size: .875rem; color: rgba(255,255,255,.35); }
        .btn-keep-shopping {
          background: #FF4500; color: #fff; border: none;
          padding: .75rem 2rem; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: .85rem; font-weight: 600;
          letter-spacing: .5px; text-transform: uppercase;
          cursor: pointer; transition: all .2s ease; margin-top: .5rem;
        }
        .btn-keep-shopping:hover {
          background: #e03d00; transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,69,0,.3);
        }

        /* ITEMS */
        .cart-items {
          flex: 1; overflow-y: auto; padding: 1rem;
          display: flex; flex-direction: column; gap: .75rem;
        }
        .cart-items::-webkit-scrollbar { width: 4px; }
        .cart-items::-webkit-scrollbar-track { background: transparent; }
        .cart-items::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

        .cart-item {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px; padding: .9rem;
          transition: all .2s ease;
        }
        .cart-item:hover {
          border-color: rgba(255,69,0,.2);
          background: rgba(255,69,0,.03);
        }
        .cart-item-img {
          width: 64px; height: 64px; border-radius: 10px;
          overflow: hidden; flex-shrink: 0;
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,.06);
        }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem; letter-spacing: 1px; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .cart-item-cat {
          font-size: .68rem; letter-spacing: 1.5px;
          text-transform: uppercase; color: #FF4500; font-weight: 500;
          margin-bottom: .35rem;
        }
        .cart-item-price { font-size: .9rem; font-weight: 600; color: rgba(255,255,255,.8); }

        .cart-item-controls {
          display: flex; flex-direction: column;
          align-items: center; gap: .5rem; flex-shrink: 0;
        }
        .qty-row {
          display: flex; align-items: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px; overflow: hidden;
        }
        .qty-btn {
          background: none; border: none; color: rgba(255,255,255,.6);
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem; font-weight: 600;
          transition: all .15s ease;
        }
        .qty-btn:hover:not(:disabled) {
          background: rgba(255,69,0,.2); color: #FF4500;
        }
        .qty-btn:disabled { opacity: .3; cursor: not-allowed; }
        .qty-num {
          font-size: .8rem; font-weight: 700; color: #fff;
          min-width: 24px; text-align: center;
        }
        .btn-remove {
          background: rgba(255,60,60,.08);
          border: 1px solid rgba(255,60,60,.15);
          color: rgba(255,100,100,.6);
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s ease;
        }
        .btn-remove:hover {
          background: rgba(255,60,60,.2);
          border-color: rgba(255,60,60,.4);
          color: #ff6b6b;
          transform: scale(1.1);
        }

        /* SUMMARY */
        .cart-summary {
          padding: 1.25rem 1.5rem 1.75rem;
          border-top: 1px solid rgba(255,255,255,.06);
          flex-shrink: 0;
        }
        .summary-rows { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1.25rem; }
        .summary-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: .85rem; color: rgba(255,255,255,.45);
        }
        .summary-row.total {
          font-size: 1rem; color: #fff; font-weight: 700;
          padding-top: .75rem;
          border-top: 1px solid rgba(255,255,255,.08);
          margin-top: .25rem;
        }
        .summary-row.total .price-total {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; letter-spacing: 1px; color: #FF4500;
        }
        .shipping-free { color: #4ade80; font-weight: 600; }
        .shipping-bar {
          height: 3px; background: rgba(255,255,255,.07);
          border-radius: 2px; margin-bottom: .5rem; overflow: hidden;
        }
        .shipping-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF4500, #ff6a35);
          border-radius: 2px;
          transition: width .4s ease;
        }
        .shipping-hint {
          font-size: .72rem; color: rgba(255,255,255,.3); margin-bottom: 1rem;
          text-align: center;
        }

        /* AUTH WARNING */
        .cart-auth-warn {
          display: flex; align-items: center; gap: .75rem;
          background: rgba(255,193,7,.07);
          border: 1px solid rgba(255,193,7,.2);
          border-radius: 10px; padding: .75rem 1rem;
          margin-bottom: 1rem;
        }
        .cart-auth-warn svg { color: #fbbf24; flex-shrink: 0; }
        .cart-auth-warn p { font-size: .8rem; color: #fbbf24; margin: 0; }

        /* BUTTONS */
        .cart-btn-group { display: flex; flex-direction: column; gap: .6rem; }
        .btn-checkout {
          width: 100%; background: #FF4500; color: #fff; border: none;
          padding: 1rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem; font-weight: 700;
          letter-spacing: .75px; text-transform: uppercase;
          cursor: pointer; transition: all .2s ease;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
        }
        .btn-checkout:hover {
          background: #e03d00; transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255,69,0,.35);
        }
        .btn-checkout.locked {
          background: rgba(255,255,255,.07);
          color: rgba(255,255,255,.35);
          cursor: not-allowed;
        }
        .btn-checkout.locked:hover { transform: none; box-shadow: none; background: rgba(255,255,255,.07); }
        .btn-continue {
          width: 100%; background: transparent; color: rgba(255,255,255,.45);
          border: 1px solid rgba(255,255,255,.1);
          padding: .75rem; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: .82rem; font-weight: 500;
          cursor: pointer; transition: all .2s ease;
        }
        .btn-continue:hover {
          border-color: rgba(255,255,255,.2); color: rgba(255,255,255,.7);
        }

        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @media(max-width:480px) { .cart-panel{max-width:100%;} }
      `}</style>

      <div className="cart-overlay" onClick={e => e.target===e.currentTarget && setShowCart(false)}>
        <div className="cart-panel">

          {/* Header */}
          <div className="cart-head">
            <div className="cart-head-left">
              <div className="cart-head-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="cart-title">Mi Carrito</span>
              {cart.length > 0 && (
                <span className="cart-count-pill">{cart.reduce((s,i)=>s+i.quantity,0)} items</span>
              )}
            </div>
            <button className="cart-close" onClick={() => setShowCart(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Empty state */}
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Carrito vacío</h3>
              <p>Agrega productos para comenzar tu pedido</p>
              <button className="btn-keep-shopping" onClick={() => setShowCart(false)}>
                Explorar productos
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="cart-item-cat">
                          {item.selectedSize && `Talla: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' • '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                      <p className="cart-item-price">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="qty-row">
                        <button className="qty-btn" disabled={item.quantity<=1} onClick={()=>updateQuantity(item.id,item.quantity-1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={()=>updateQuantity(item.id,item.quantity+1)}>+</button>
                      </div>
                      <button className="btn-remove" onClick={()=>removeFromCart(item.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                {/* Barra de envío gratis */}
                {subtotal < 150 && (
                  <>
                    <div className="shipping-bar">
                      <div className="shipping-bar-fill" style={{width:`${Math.min((subtotal/150)*100,100)}%`}}/>
                    </div>
                    <p className="shipping-hint">
                      Agrega S/ {(150-subtotal).toFixed(2)} más para <strong style={{color:'#4ade80'}}>envío gratis</strong>
                    </p>
                  </>
                )}

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Envío</span>
                    <span className={shipping===0?'shipping-free':''}>{shipping===0?'Gratis':`S/ ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span className="price-total">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {!user && (
                  <div className="cart-auth-warn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p><strong>Inicia sesión</strong> para completar tu compra</p>
                  </div>
                )}

                <div className="cart-btn-group">
                  <button
                    className={`btn-checkout ${!user?'locked':''}`}
                    onClick={handleCheckoutClick}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {!user ? 'Inicia sesión para pagar' : `Pagar · S/ ${total.toFixed(2)}`}
                  </button>
                  <button className="btn-continue" onClick={() => setShowCart(false)}>
                    Seguir comprando
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart