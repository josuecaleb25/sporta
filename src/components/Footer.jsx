const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 pb-5 mt-auto border-t-2 border-blue-600">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10">
        <div>
          <h3 className="text-blue-500 text-2xl font-bold mb-2">Adidas</h3>
          <p className="text-gray-400">Impossible is Nothing</p>
        </div>
        <div>
          <h4 className="text-blue-500 text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            {['products','about','contact'].map((item) => (
              <li key={item}>
                <a href={`#${item}`} className="text-gray-400 no-underline transition-colors duration-300 hover:text-blue-500 capitalize">
                  {item === 'products' ? 'Productos' : item === 'about' ? 'Nosotros' : 'Contacto'}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-blue-500 text-lg font-semibold mb-4">Contacto</h4>
          <p className="text-gray-400 mb-1">Email: info@adidas.com</p>
          <p className="text-gray-400">Teléfono: +1 234 567 890</p>
        </div>
      </div>
      <div className="border-t border-white/10 mt-10 pt-5 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Adidas. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer