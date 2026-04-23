import { useState } from 'react'
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

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [darkMode, setDarkMode] = useState(true)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const addToCart = (product) => {
    // Verificar si el usuario está autenticado
    if (!user) {
      setShowAuth(true); // Mostrar modal de autenticación
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const viewProductDetail = (product) => {
    setSelectedProduct(product)
    setCurrentPage('product-detail')
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCart([]) // Limpiar carrito al cerrar sesión
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setShowAuth(false)
  }

  // Función para manejar el checkout desde el carrito
  const handleCheckout = () => {
    console.log('handleCheckout llamado');
    
    // Verificar autenticación antes del checkout
    if (!user) {
      setShowCart(false);
      setShowAuth(true);
      return;
    }
    
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  // Función para volver del checkout
  const handleReturnFromCheckout = () => {
    setShowCheckout(false);
    setShowCart(true);
  };

  // Función cuando se completa la orden
  const handleOrderComplete = () => {
    setCart([]); // Limpiar carrito
    setShowCheckout(false);
    setCurrentPage('home');
    alert('¡Pedido completado exitosamente!');
  };

  // Función cuando se hace clic en el icono del carrito en el Navbar
  const handleCartClick = () => {
    setShowCart(true);
  };

  const renderPage = () => {
    // Si estamos en checkout, mostrar solo el checkout
    if (showCheckout) {
      return (
        <Checkout 
          cart={cart}
          getTotalPrice={getTotalPrice}
          onReturnToCart={handleReturnFromCheckout}
          onOrderComplete={handleOrderComplete}
          user={user}
        />
      );
    }

    switch(currentPage) {
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
        return <Products 
          addToCart={addToCart} 
          viewProductDetail={viewProductDetail}
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />
      case 'product-detail':
        return <ProductDetail 
          product={selectedProduct} 
          addToCart={addToCart}
          onBack={() => setCurrentPage('products')}
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />
      case 'about':
        return <About />
      case 'contact':
        return <Contact darkMode={darkMode} />
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
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {/* Mostrar Navbar siempre */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        cartItemsCount={getTotalItems()}
        setShowCart={handleCartClick}
        user={user}
        onLogout={handleLogout}
        setShowAuth={setShowAuth}
      />
      
      <main>
        {renderPage()}
      </main>

      {/* Mostrar Footer siempre excepto en checkout */}
      {!showCheckout && <Footer />}
      
      {/* Modal del Carrito */}
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

      {/* Modal de Autenticación */}
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