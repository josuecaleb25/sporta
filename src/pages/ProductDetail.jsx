import { useState } from 'react'
import '../styles/ProductDetail.css'

const ProductDetail = ({ product, addToCart, onBack, user, onShowAuth }) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Verifica si el producto llega
  console.log('🔍 ProductDetail - producto:', product)

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <button onClick={onBack} className="back-button">
            Volver a Productos
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      onShowAuth()
      return
    }
    
    const productToAdd = {
      ...product,
      selectedSize: selectedSize || 'Única',
      selectedColor: selectedColor || 'Standard',
      quantity
    }
    addToCart(productToAdd)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  // Datos por defecto para productos básicos
  const features = product.features || [
    'Tecnología Boost para máxima comodidad',
    'Suela de goma durable',
    'Material transpirable',
    'Diseño ergonómico'
  ]

  const sizes = product.sizes || ['38', '39', '40', '41', '42', '43', '44']
  const colors = product.colors || ['Negro', 'Blanco', 'Azul', 'Rojo']
  const description = product.description || `Zapatillas ${product.name} de la colección Adidas. Calidad premium y diseño innovador.`

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        {/* Header con botón de volver */}
        <div className="detail-header">
          <button onClick={onBack} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver a Productos
          </button>
        </div>

        <div className="detail-content">
          {/* Imagen del producto */}
          <div className="product-image-section">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            {product.badge && (
              <div className="product-badge-detail">{product.badge}</div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-info-section">
            <div className="product-category-tag">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price-detail">S/{product.price}</p>
            
            <p className="product-description">{description}</p>

            {/* Características */}
            <div className="features-section">
              <h3>Características Principales</h3>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-dot"></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de Talla */}
            <div className="size-section">
              <h3>Selecciona tu talla</h3>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Color */}
            <div className="color-section">
              <h3>Color</h3>
              <div className="color-options">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Cantidad y Botón */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <h3>Cantidad</h3>
                <div className="quantity-controls">
                  <button onClick={decreaseQuantity}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increaseQuantity}>+</button>
                </div>
              </div>

              <button 
                className="add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Agregar al Carrito - S/{(product.price * quantity).toFixed(2)}
              </button>
            </div>

            {/* Información adicional */}
            <div className="additional-info">
              <div className="info-item">
                <strong>Envío gratuito</strong> en compras superiores a S/150
              </div>
              <div className="info-item">
                <strong>Devoluciones gratuitas</strong> dentro de los 30 días
              </div>
              <div className="info-item">
                <strong>Garantía</strong> de 2 años en materiales
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail