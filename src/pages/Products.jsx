import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/Products.css'

const Products = ({ addToCart, viewProductDetail, user, onShowAuth }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Array de productos con tus imágenes
  const products = [
    {
      id: 1,
      name: "Adidas Ultraboost 21",
      category: "running",
      price: 449.99,
      image: "/src/assets/shoe1.jpg",
      badge: "Nuevo",
      description: "Zapatillas de running con tecnología Boost"
    },
    {
      id: 2,
      name: "Adidas NMD R1",
      category: "lifestyle",
      price: 399.99,
      image: "/src/assets/shoe2.jpg",
      badge: "Popular",
      description: "Zapatillas urbanas con estilo único"
    },
    {
      id: 3,
      name: "Adidas Superstar",
      category: "lifestyle",
      price: 349.99,
      image: "/src/assets/shoe3.jpg",
      badge: "Clásico",
      description: "Las clásicas zapatillas con caparazón"
    },
    {
      id: 4,
      name: "Adidas Forum Low",
      category: "basketball",
      price: 379.99,
      image: "/src/assets/shoe4.jpg",
      badge: "Retro",
      description: "Zapatillas de basketball retro"
    },
    {
      id: 5,
      name: "Adidas ZX 2K Boost",
      category: "running",
      price: 419.99,
      image: "/src/assets/shoe5.jpg",
      badge: "Boost",
      description: "Máxima comodidad con tecnología Boost"
    },
    {
      id: 6,
      name: "Adidas Stan Smith",
      category: "lifestyle",
      price: 329.99,
      image: "/src/assets/shoe6.jpg",
      badge: "Icono",
      description: "Zapatillas icónicas de cuero"
    }
  ]

  const categories = ['all', ...new Set(products.map(product => product.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Si el usuario NO está logueado, mostrar solo el banner
  if (!user) {
    return (
      <div className="products-page">
        <div className="products-header">
          <h1>Nuestros Productos</h1>
          <p>Descubre la última colección de Adidas</p>
        </div>

        {/* Banner de login cuando NO hay usuario */}
        <div className="login-banner">
          <div className="login-banner-content">
            <div className="login-banner-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="login-banner-text">
              <h2>Inicia sesión para ver nuestros productos</h2>
              <p>Accede a tu cuenta para explorar toda nuestra colección exclusiva de Adidas</p>
            </div>
            <button className="login-banner-btn" onClick={onShowAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si el usuario SÍ está logueado, mostrar productos normalmente
  return (
    <div className="products-page">
      {/* Header de productos */}
      <div className="products-header">
        <h1>Nuestros Productos</h1>
        <p>Descubre la última colección de Adidas</p>
      </div>

      {/* Filtros y búsqueda - Solo para usuarios logueados */}
      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos - Solo para usuarios logueados */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            viewProductDetail={viewProductDetail}
            user={user}
            onShowAuth={onShowAuth}
          />
        ))}
      </div>

      {/* Mensaje si no hay productos */}
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 12V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 9H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 3H15V5H9V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros términos de búsqueda o categorías</p>
        </div>
      )}
    </div>
  )
}

export default Products