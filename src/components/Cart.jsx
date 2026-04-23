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
    if (cart.length === 0) { alert('Tu carrito está vacío'); return }
    if (!user) { setShowCart(false); onShowAuth(); return }
    onCheckout()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex justify-end animate-[fadeIn_0.3s_ease]">
      <div className="w-full max-w-md h-full bg-black border-l-2 border-blue-600 flex flex-col animate-[slideIn_0.3s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-zinc-900 border-b border-white/10">
          <h2 className="text-white text-xl font-bold tracking-wide" style={{fontFamily: 'Orbitron, sans-serif'}}>
            Carrito
          </h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-white p-2 rounded-md transition-all duration-300 hover:bg-blue-600 hover:rotate-90 cursor-pointer border-none bg-transparent"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-gray-600 mb-5">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-white text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-400 mb-6">Agrega algunos productos increíbles</p>
              <button
                onClick={() => setShowCart(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 border-none"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3 border border-white/10 transition-all duration-300 hover:border-blue-600 hover:-translate-y-0.5"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-blue-500 text-xs uppercase tracking-wide mb-1">{item.category}</p>
                      <p className="text-white font-bold">S/{item.price}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center bg-black border border-white/20 rounded-full px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors bg-transparent border-none"
                        >-</button>
                        <span className="text-white font-semibold px-2 min-w-[20px] text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600 transition-colors bg-transparent border-none"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 hover:scale-110 transition-all duration-300 border-none"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="px-5 py-5 bg-zinc-900 border-t border-white/10 space-y-4">
                {!user && (
                  <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-400 flex-shrink-0">
                      <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <p className="text-yellow-400 text-sm">
                      <strong>Inicia sesión</strong> para completar tu compra
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white font-semibold text-lg">Total:</span>
                  <span className="text-blue-500 text-2xl font-extrabold" style={{fontFamily: 'Orbitron, sans-serif'}}>
                    S/{getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full bg-transparent text-white border-2 border-blue-600 py-3 rounded-lg font-semibold uppercase tracking-wide cursor-pointer hover:bg-blue-600 transition-all duration-300"
                  >
                    Seguir Comprando
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className={`w-full py-3 rounded-lg font-semibold uppercase tracking-wide cursor-pointer border-none transition-all duration-300 text-white
                      ${!user
                        ? 'bg-gray-600 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40'
                      }`}
                  >
                    {!user ? 'Iniciar Sesión para Pagar' : 'Proceder al Pago'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  )
}

export default Cart