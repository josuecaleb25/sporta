import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Auth from './components/Auth'
import Checkout from './pages/Checkout'
import AdminDashboard from './components/AdminDashboard'
import { api } from './api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [loadingCart, setLoadingCart] = useState(false)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('sporta_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (err) {
        console.error('Error al cargar datos guardados:', err)
        localStorage.removeItem('sporta_user')
      }
    }
  }, [])

  // Cargar carrito desde la base de datos cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadCartFromDB()
    } else {
      setCart([])
    }
  }, [user])

  const loadCartFromDB = async () => {
    if (!user) return
    setLoadingCart(true)
    try {
      const response = await api.getCart()
      if (response.cart) {
        setCart(response.cart)
      }
    } catch (err) {
      console.error('Error cargando carrito:', err)
    }
    setLoadingCart(false)
  }

  const addToCart = async (product) => {
    if (!user) { setShowAuth(true); return }
    
    try {
      // Agregar al backend
      await api.addToCart(product.id, product.quantity || 1, product.selectedSize, product.selectedColor)
      
      // Recargar carrito desde el backend
      await loadCartFromDB()
    } catch (err) {
      console.error('Error agregando al carrito:', err)
      alert('Error al agregar el producto al carrito')
    }
  }

  const viewProductDetail = (product) => {
    setSelectedProduct(product)
    setCurrentPage('product-detail')
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await api.removeFromCart(cartItemId)
      await loadCartFromDB()
    } catch (err) {
      console.error('Error eliminando del carrito:', err)
      alert('Error al eliminar el producto')
    }
  }

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await api.updateCartItem(cartItemId, newQuantity)
      await loadCartFromDB()
    } catch (err) {
      console.error('Error actualizando cantidad:', err)
      alert('Error al actualizar la cantidad')
    }
  }

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0)
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const handleLogin = (userData) => {
    setUser(userData)
    setShowAuth(false)
    
    // Guardar usuario en localStorage
    localStorage.setItem('sporta_user', JSON.stringify(userData))
    
    // Guardar token si viene en userData
    if (userData.token) {
      localStorage.setItem('sporta_token', userData.token)
    }
    
    // El carrito se cargará automáticamente por el useEffect
  }

  const handleLogout = async () => {
    // Limpiar la sesión
    localStorage.removeItem('sporta_user')
    localStorage.removeItem('sporta_token')
    
    setUser(null)
    setCart([])
    setShowCheckout(false)
    setCurrentPage('home')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setShowAuth(false)
    
    // Guardar usuario en localStorage
    localStorage.setItem('sporta_user', JSON.stringify(userData))
  }

  const handleCheckout = () => {
    if (!user) { setShowCart(false); setShowAuth(true); return }
    if (cart.length === 0) { alert('Tu carrito está vacío'); return }
    setShowCart(false)
    setShowCheckout(true)
  }

  const handleReturnFromCheckout = () => {
    setShowCheckout(false)
    setShowCart(true)
  }

  const handleOrderComplete = async () => {
    // Limpiar carrito en la base de datos
    try {
      await api.clearCart()
      setCart([])
    } catch (err) {
      console.error('Error limpiando carrito:', err)
    }
  }

  // Si el usuario logueado es admin, mostrar solo el panel de administración
  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  const renderPage = () => {
    if (showCheckout) {
      return (
        <Checkout
          cart={cart}
          getTotalPrice={getTotalPrice}
          onReturnToCart={handleReturnFromCheckout}
          onOrderComplete={handleOrderComplete}
          user={user}
        />
      )
    }
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <Stats />
            <Products
              addToCart={addToCart}
              viewProductDetail={viewProductDetail}
              user={user}
              onShowAuth={() => setShowAuth(true)}
            />
          </>
        )
      case 'products':
        return (
          <Products
            addToCart={addToCart}
            viewProductDetail={viewProductDetail}
            user={user}
            onShowAuth={() => setShowAuth(true)}
          />
        )
      case 'product-detail':
        return (
          <ProductDetail
            product={selectedProduct}
            addToCart={addToCart}
            onBack={() => setCurrentPage('products')}
            user={user}
            onShowAuth={() => setShowAuth(true)}
          />
        )
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return (
          <>
            <Hero />
            <Stats />
            <Products
              addToCart={addToCart}
              viewProductDetail={viewProductDetail}
              user={user}
              onShowAuth={() => setShowAuth(true)}
            />
          </>
        )
    }
  }

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page)
          setShowCheckout(false) // Cerrar checkout al navegar
        }}
        cartItemsCount={getTotalItems()}
        setShowCart={() => setShowCart(true)}
        user={user}
        onLogout={handleLogout}
        setShowAuth={setShowAuth}
      />

      <main>{renderPage()}</main>

      {!showCheckout && <Footer />}

      {showCart && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          getTotalPrice={getTotalPrice}
          setShowCart={setShowCart}
          onCheckout={handleCheckout}
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  )
}

export default App