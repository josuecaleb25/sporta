const Navbar = ({
  currentPage,
  setCurrentPage,
  darkMode,
  toggleDarkMode,
  cartItemsCount,
  setShowCart,
  user,
  onLogout,
  setShowAuth
}) => {
  return (
    <nav className={`sticky top-0 z-50 border-b-2 border-blue-600 transition-all duration-300 ${darkMode ? 'bg-black' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="-ml-6">
          <img
            src={darkMode ? "/src/assets/adidas-logo2.png" : "/src/assets/adidas-logo.png"}
            alt="Adidas Logo"
            className="h-9 w-auto transition-all duration-300"
          />
        </div>

        {/* Menú */}
        <ul className="flex list-none gap-8 m-0 p-0">
          {[
            { label: 'Inicio', page: 'home' },
            { label: 'Productos', page: 'products' },
            { label: 'Nosotros', page: 'about' },
            { label: 'Contacto', page: 'contact' },
          ].map(({ label, page }) => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                className={`relative overflow-hidden font-medium text-base px-4 py-2 rounded-md transition-all duration-300 font-sans cursor-pointer border-none
                  ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-white hover:bg-blue-600 hover:text-white hover:-translate-y-0.5'
                      : 'text-gray-700 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5'
                  }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Acciones */}
        <div className="flex items-center gap-3 ml-8">

          {/* Botón usuario / login */}
          {user ? (
            <div className="relative group">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-300 cursor-pointer
                ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {user.name}
              </button>
              <div className={`absolute right-0 top-full mt-2 min-w-[150px] rounded-xl border-2 p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-[-8px] group-hover:translate-y-0 transition-all duration-300
                ${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
                <button
                  onClick={onLogout}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-300 cursor-pointer
                ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Iniciar Sesión
            </button>
          )}

          {/* Carrito */}
          <button
            onClick={() => setShowCart(true)}
            className={`relative flex items-center justify-center w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-300
              ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5'}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-300
              ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5'}`}
          >
            {darkMode ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.754 21.1181 10.0804 20.7461C8.40686 20.3741 6.86793 19.5345 5.644 18.326C4.42007 17.1174 3.565 15.5915 3.184 13.928C2.803 12.2645 2.912 10.5335 3.498 8.9208C4.084 7.3081 5.121 5.9528 6.476 4.9608C7.831 3.9688 9.439 3.3855 11.14 3.28C10.538 4.651 10.338 6.187 10.568 7.678C10.798 9.169 11.447 10.557 12.44 11.68C13.433 12.803 14.728 13.612 16.16 14.01C17.592 14.408 19.095 14.377 20.51 13.92C20.829 13.82 21 12.79 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 768px) {
          nav > div { flex-direction: column; gap: 1rem; }
          nav ul { flex-direction: column; gap: 0.75rem; text-align: center; margin-left: 0 !important; }
          nav .ml-8 { margin-left: 0; gap: 0.5rem; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar