import { useState, useEffect } from 'react';
import '../styles/Checkout.css';

// Importar iconos de Lucide
import { 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Landmark, 
  Banknote,
  ShoppingCart,
  Shield,
  Mail,
  FileText,
  User,
  Phone,
  MapPin,
  Clock,
  Truck,
  Download,
  Calendar,
  CreditCard as CardIcon,
  UserCheck
} from 'lucide-react';

const Checkout = ({ cart, getTotalPrice, onReturnToCart, onOrderComplete }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  
  // Estado para Formspree - con manejo de errores
  const [formState, setFormState] = useState({
    submitting: false,
    succeeded: false,
    error: null
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    reference: '',
    deliveryNotes: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Asegurarnos de que cart siempre sea un array
  const cartItems = cart || [];

  // Tu ID de Formspree - REEMPLAZA ESTO con tu ID real
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movkyjko";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (formError) setFormError('');
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardInfo(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Formatear fecha de expiración
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setCardInfo(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!customerInfo.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email inválido';
    if (!customerInfo.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!customerInfo.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!customerInfo.district) newErrors.district = 'Selecciona un distrito';
    
    // Validar información de tarjeta si se selecciona pago con tarjeta
    if (selectedPayment === 'credit') {
      if (!cardInfo.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Número de tarjeta requerido';
      else if (cardInfo.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número de tarjeta inválido';
      if (!cardInfo.expiryDate) newErrors.expiryDate = 'Fecha de expiración requerida';
      if (!cardInfo.cvv) newErrors.cvv = 'CVV requerido';
      else if (cardInfo.cvv.length !== 3) newErrors.cvv = 'CVV inválido';
      if (!cardInfo.cardName.trim()) newErrors.cardName = 'Nombre en la tarjeta requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función mejorada para enviar a Formspree con manejo de errores
  const submitToFormspree = async (formData) => {
    try {
      setFormState({ submitting: true, succeeded: false, error: null });
      
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setFormState({ submitting: false, succeeded: true, error: null });
      return data;
      
    } catch (error) {
      console.error('Error enviando a Formspree:', error);
      setFormState({ 
        submitting: false, 
        succeeded: false, 
        error: error.message 
      });
      throw error;
    }
  };

  // Generar comprobante automático
  const generateReceipt = () => {
    const receiptNumber = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const receiptDate = new Date().toLocaleDateString('es-PE');
    
    return {
      receiptNumber,
      receiptAmount: getTotalPrice ? getTotalPrice().toFixed(2) : '0.00',
      receiptDate,
      bankName: selectedPayment === 'yape' ? 'Yape' : 
                selectedPayment === 'transfer' ? 'Transferencia Bancaria' : 
                selectedPayment === 'credit' ? 'Tarjeta de Crédito/Débito' : 'Efectivo'
    };
  };

  const downloadReceipt = () => {
    const receiptInfo = generateReceipt();
    const receiptText = `
COMPROBANTE DE PAGO - TIENDA ADIDAS
=====================================
Número: ${receiptInfo.receiptNumber}
Fecha: ${receiptInfo.receiptDate}
Método de Pago: ${receiptInfo.bankName}
Monto Total: S/ ${receiptInfo.receiptAmount}

INFORMACIÓN DEL CLIENTE
=======================
Nombre: ${customerInfo.name}
Email: ${customerInfo.email}
Teléfono: ${customerInfo.phone}
Dirección: ${customerInfo.address}
Distrito: ${customerInfo.district}
${customerInfo.reference ? `Referencia: ${customerInfo.reference}` : ''}
${customerInfo.deliveryNotes ? `Indicaciones: ${customerInfo.deliveryNotes}` : ''}

DETALLE DEL PEDIDO
==================
${cartItems.map(item => 
  `${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

TOTAL: S/ ${receiptInfo.receiptAmount}

¡Gracias por tu compra!
Tu pedido será procesado y enviado en 2-3 días hábiles.
    `.trim();
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante-${receiptInfo.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    if (!selectedPayment) {
      setFormError('Por favor selecciona un método de pago');
      return;
    }
    
    if (!validateForm()) {
      setFormError('Por favor corrige los errores en el formulario');
      return;
    }

    setIsProcessing(true);
    setFormError('');

    try {
      // Generar comprobante automático
      const receiptInfo = generateReceipt();
      
      // Crear datos para el formulario
      const formData = {
        _subject: `Nuevo Pedido - ${receiptInfo.receiptNumber}`,
        _replyto: customerInfo.email,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerDistrict: customerInfo.district,
        customerReference: customerInfo.reference,
        deliveryNotes: customerInfo.deliveryNotes,
        paymentMethod: selectedPayment,
        totalAmount: getTotalPrice ? getTotalPrice().toFixed(2) : '0.00',
        orderItems: JSON.stringify(cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: (item.price * item.quantity).toFixed(2)
        }))),
        receiptNumber: receiptInfo.receiptNumber,
        receiptAmount: receiptInfo.receiptAmount,
        receiptDate: receiptInfo.receiptDate,
        bankName: receiptInfo.bankName,
        orderDate: new Date().toLocaleString('es-PE')
      };

      console.log('Enviando datos del pedido:', formData);

      // Intentar enviar a Formspree (pero continuar aunque falle)
      try {
        await submitToFormspree(formData);
        console.log('Formulario enviado exitosamente a Formspree');
      } catch (formspreeError) {
        console.warn('Formspree no disponible, pero continuando con el pedido...');
        // Continuamos aunque Formspree falle
      }
      
      // Simular procesamiento del pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderCompleted(true);
      if (onOrderComplete) {
        onOrderComplete();
      }
      
    } catch (error) {
      console.error('Error procesando el pago:', error);
      setFormError('Hubo un error procesando tu pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Renderizar detalles específicos del método de pago
  const renderPaymentDetails = () => {
    switch (selectedPayment) {
      case 'credit':
        return (
          <div className="payment-details">
            <div className="payment-details-header">
              <CardIcon size={24} />
              <h4>Información de Tarjeta</h4>
            </div>
            <div className="card-form">
              <div className="form-group full-width">
                <label htmlFor="cardNumber">
                  <CreditCard size={16} />
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardInfo.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
              
              <div className="card-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">
                    <Calendar size={16} />
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardInfo.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">
                    <Shield size={16} />
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    maxLength="3"
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="cardName">
                  <UserCheck size={16} />
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardInfo.cardName}
                  onChange={handleCardInputChange}
                  placeholder="Como aparece en la tarjeta"
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
              </div>
            </div>
          </div>
        );
      
      case 'yape':
        return (
          <div className="payment-details">
            <div className="payment-details-header">
              <Smartphone size={24} />
              <h4>Pago con Yape/Plin</h4>
            </div>
            <div className="digital-wallet">
              <div className="digital-wallet-info">
                <div className="digital-wallet-item">
                  <strong>Número Yape:</strong>
                  <span>+51 999 888 777</span>
                </div>
                <div className="digital-wallet-item">
                  <strong>Número Plin:</strong>
                  <span>+51 999 888 777</span>
                </div>
                <div className="digital-wallet-item">
                  <strong>Nombre:</strong>
                  <span>TIENDA ADIDAS OFFICIAL</span>
                </div>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                Después de realizar el pago, se generará automáticamente tu comprobante
              </p>
            </div>
          </div>
        );
      
      case 'transfer':
        return (
          <div className="payment-details">
            <div className="payment-details-header">
              <Landmark size={24} />
              <h4>Transferencia Bancaria</h4>
            </div>
            <div className="bank-info">
              <p>Realiza la transferencia a cualquiera de nuestras cuentas:</p>
              <div className="bank-details">
                <div className="bank-detail-item">
                  <span className="bank-detail-label">BCP - Soles</span>
                  <span className="bank-detail-value">191-23456789-0-45</span>
                  <span className="bank-detail-label">TIENDA ADIDAS S.A.C.</span>
                </div>
                <div className="bank-detail-item">
                  <span className="bank-detail-label">Interbank - Soles</span>
                  <span className="bank-detail-value">898-3100001234</span>
                  <span className="bank-detail-label">TIENDA ADIDAS S.A.C.</span>
                </div>
                <div className="bank-detail-item">
                  <span className="bank-detail-label">BBVA - Soles</span>
                  <span className="bank-detail-value">0011-0234-0200057891</span>
                  <span className="bank-detail-label">TIENDA ADIDAS S.A.C.</span>
                </div>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                Envíanos el comprobante de transferencia para procesar tu pedido
              </p>
            </div>
          </div>
        );
      
      case 'cash':
        return (
          <div className="payment-details">
            <div className="payment-details-header">
              <Banknote size={24} />
              <h4>Pago Contra Entrega</h4>
            </div>
            <div className="cash-payment">
              <div className="cash-info">
                <p>Paga en efectivo cuando recibas tu pedido</p>
                <div className="cash-features">
                  <div className="cash-feature">
                    <strong>💵 Efectivo</strong>
                    <span>Aceptamos soles exactos</span>
                  </div>
                  <div className="cash-feature">
                    <strong>📦 Al recibir</strong>
                    <span>Revisa tu pedido antes de pagar</span>
                  </div>
                  <div className="cash-feature">
                    <strong>🚚 Delivery</strong>
                    <span>Entrega en 2-3 días hábiles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (orderCompleted || formState.succeeded) {
    const receiptInfo = generateReceipt();
    
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>¡Pedido Confirmado!</h2>
          
          <div className="receipt-summary">
            <div className="receipt-header">
              <FileText size={24} />
              <h3>Comprobante de Pago Generado</h3>
            </div>
            <div className="receipt-details">
              <div className="receipt-item">
                <span>Número de Comprobante:</span>
                <strong>{receiptInfo.receiptNumber}</strong>
              </div>
              <div className="receipt-item">
                <span>Fecha:</span>
                <span>{receiptInfo.receiptDate}</span>
              </div>
              <div className="receipt-item">
                <span>Método de Pago:</span>
                <span>{receiptInfo.bankName}</span>
              </div>
              <div className="receipt-item">
                <span>Monto Total:</span>
                <strong>S/ {receiptInfo.receiptAmount}</strong>
              </div>
            </div>
          </div>

          <div className="success-details">
            <div className="success-item">
              <User size={20} />
              <span><strong>Cliente:</strong> {customerInfo.name}</span>
            </div>
            <div className="success-item">
              <Mail size={20} />
              <span><strong>Email:</strong> {customerInfo.email}</span>
            </div>
            <div className="success-item">
              <Phone size={20} />
              <span><strong>Teléfono:</strong> {customerInfo.phone}</span>
            </div>
            <div className="success-item">
              <MapPin size={20} />
              <span><strong>Dirección:</strong> {customerInfo.address}, {customerInfo.district}</span>
            </div>
            <div className="success-item">
              <Truck size={20} />
              <span><strong>Envío:</strong> 2-3 días hábiles</span>
            </div>
          </div>
          
          <p className="success-message">
            {formState.succeeded 
              ? `Hemos enviado tu comprobante de pago a ${customerInfo.email}. Tu pedido será procesado y enviado en los próximos días.`
              : `Tu pedido ha sido procesado exitosamente. Descarga tu comprobante a continuación.`
            }
          </p>
          
          <div className="success-actions">
            <button className="download-receipt" onClick={downloadReceipt}>
              <Download size={20} />
              Descargar Comprobante
            </button>
            <button className="continue-shopping" onClick={onReturnToCart}>
              <ShoppingCart size={20} />
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        <button className="back-button" onClick={onReturnToCart}>
          <ArrowLeft size={16} />
          Volver al Carrito
        </button>
      </div>

      {formError && (
        <div className="form-error-message">
          {formError}
        </div>
      )}

      {formState.error && (
        <div className="form-warning-message">
          ⚠️ No se pudo conectar con el servidor, pero puedes continuar con tu pedido.
        </div>
      )}

      <div className="checkout-content">
        {/* Sección de Información de Contacto y Envío */}
        <div className="customer-info">
          <div className="section-header">
            <User size={24} />
            <h3>Información de Contacto y Envío</h3>
          </div>
          
          <div className="info-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre completo"
                  required
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+51 999 888 777"
                  required
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="district">
                  <MapPin size={16} />
                  Distrito *
                </label>
                <select
                  id="district"
                  name="district"
                  value={customerInfo.district}
                  onChange={handleInputChange}
                  required
                  className={errors.district ? 'error' : ''}
                >
                  <option value="">Selecciona tu distrito</option>
                  <option value="Lima">Lima</option>
                  <option value="Miraflores">Miraflores</option>
                  <option value="San Isidro">San Isidro</option>
                  <option value="Barranco">Barranco</option>
                  <option value="Surco">Surco</option>
                  <option value="La Molina">La Molina</option>
                  <option value="Jesus Maria">Jesus Maria</option>
                  <option value="Lince">Lince</option>
                  <option value="Magdalena">Magdalena</option>
                  <option value="Pueblo Libre">Pueblo Libre</option>
                  <option value="San Miguel">San Miguel</option>
                </select>
                {errors.district && <span className="error-message">{errors.district}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                <MapPin size={16} />
                Dirección completa *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="Calle, número, departamento, urbanización"
                required
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reference">
                  Referencia de la dirección
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={customerInfo.reference}
                  onChange={handleInputChange}
                  placeholder="Ej: Frente al parque, altura de..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deliveryNotes">
                  Indicaciones de entrega
                </label>
                <input
                  type="text"
                  id="deliveryNotes"
                  name="deliveryNotes"
                  value={customerInfo.deliveryNotes}
                  onChange={handleInputChange}
                  placeholder="Ej: Timbre azul, dejar con conserje"
                />
              </div>
            </div>

            <div className="delivery-info">
              <div className="delivery-item">
                <Truck size={20} />
                <span>Envío estándar: 2-3 días hábiles</span>
              </div>
              <div className="delivery-item">
                <Clock size={20} />
                <span>Horario de entrega: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Resumen del Pedido */}
        <div className="order-summary">
          <div className="section-header">
            <ShoppingCart size={24} />
            <h3>Resumen del Pedido</h3>
          </div>
          <div className="order-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <ShoppingCart size={48} />
                <p>No hay productos en el carrito</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                    <p>S/ {item.price} c/u</p>
                  </div>
                  <div className="item-total">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="order-total">
            <h3>Total: S/ {getTotalPrice ? getTotalPrice().toFixed(2) : '0.00'}</h3>
          </div>
        </div>

        {/* Sección de Métodos de Pago */}
        <div className="payment-section">
          <div className="section-header">
            <CreditCard size={24} />
            <h3>Métodos de Pago</h3>
          </div>
          
          <div className="payment-methods">
            <div 
              className={`payment-option ${selectedPayment === 'credit' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('credit')}
            >
              <div className="payment-icon">
                <CreditCard size={24} />
              </div>
              <div className="payment-info">
                <h4>Tarjeta de Crédito/Débito</h4>
                <p>Pago inmediato - Comprobante automático</p>
              </div>
              <div className="radio-circle">
                {selectedPayment === 'credit' && <div className="radio-dot"></div>}
              </div>
            </div>

            <div 
              className={`payment-option ${selectedPayment === 'yape' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('yape')}
            >
              <div className="payment-icon">
                <Smartphone size={24} />
              </div>
              <div className="payment-info">
                <h4>Yape / Plin</h4>
                <p>Comprobante automático por correo</p>
              </div>
              <div className="radio-circle">
                {selectedPayment === 'yape' && <div className="radio-dot"></div>}
              </div>
            </div>

            <div 
              className={`payment-option ${selectedPayment === 'transfer' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('transfer')}
            >
              <div className="payment-icon">
                <Landmark size={24} />
              </div>
              <div className="payment-info">
                <h4>Transferencia Bancaria</h4>
                <p>Comprobante automático por correo</p>
              </div>
              <div className="radio-circle">
                {selectedPayment === 'transfer' && <div className="radio-dot"></div>}
              </div>
            </div>

            <div 
              className={`payment-option ${selectedPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('cash')}
            >
              <div className="payment-icon">
                <Banknote size={24} />
              </div>
              <div className="payment-info">
                <h4>Pago contra entrega</h4>
                <p>Paga en efectivo al recibir</p>
              </div>
              <div className="radio-circle">
                {selectedPayment === 'cash' && <div className="radio-dot"></div>}
              </div>
            </div>
          </div>

          {/* Detalles específicos del método de pago seleccionado */}
          {selectedPayment && renderPaymentDetails()}

          <button 
            className={`pay-button ${isProcessing ? 'processing' : ''}`}
            onClick={handlePayment}
            disabled={cartItems.length === 0 || isProcessing || formState.submitting}
          >
            {isProcessing || formState.submitting ? (
              <>
                <div className="loading-spinner"></div>
                {formState.submitting ? 'Enviando...' : 'Procesando Pago...'}
              </>
            ) : (
              <>
                <Shield size={20} />
                Confirmar Pedido - S/ {getTotalPrice ? getTotalPrice().toFixed(2) : '0.00'}
              </>
            )}
          </button>

          {formState.error && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '1rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              ⚠️ El pedido se procesará localmente
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;