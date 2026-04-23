const ProductCard = ({ product, addToCart, viewProductDetail, user, onShowAuth }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
  }

  const handleLoginRequired = (e) => {
    e.stopPropagation()
    onShowAuth()
  }

  return (
    <div
      onClick={() => viewProductDetail(product)}
      className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer transition-all duration-400 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/15 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-600 before:to-red-600 before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100"
    >
      {/* Imagen */}
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white leading-snug">
          {product.name}
        </h3>
        <p className="text-blue-600 text-xs uppercase tracking-widest font-semibold mb-3">
          {product.category}
        </p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-5 font-mono">
          S/{product.price}
        </p>

        {user ? (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white/10 text-white py-3 rounded-xl font-semibold uppercase tracking-wide text-sm cursor-pointer border-none transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Agregar al Carrito
          </button>
        ) : (
          <button
            onClick={handleLoginRequired}
            className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold uppercase tracking-wide text-sm cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Iniciar Sesión para Comprar
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCard