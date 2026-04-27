import { useState } from 'react';
import {
  CheckCircle, ArrowLeft, CreditCard, Smartphone, Landmark, Banknote,
  ShoppingCart, Shield, Mail, FileText, User, Phone, MapPin, Clock,
  Truck, Download, Calendar, CreditCard as CardIcon, UserCheck
} from 'lucide-react';

const Checkout = ({ cart, getTotalPrice, onReturnToCart, onOrderComplete, user }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formState, setFormState] = useState({ submitting: false, succeeded: false, error: null });

  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', address: '', district: '', reference: '', deliveryNotes: ''
  });
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardName: '' });

  const cartItems = cart || [];
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/movkyjko';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardInfo(prev => ({ ...prev, [name]: value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim() }));
      return;
    }
    if (name === 'expiryDate') {
      setCardInfo(prev => ({ ...prev, [name]: value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2') }));
      return;
    }
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const e = {};
    if (!customerInfo.name.trim()) e.name = 'El nombre es requerido';
    if (!customerInfo.email.trim()) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) e.email = 'Email inválido';
    if (!customerInfo.phone.trim()) e.phone = 'El teléfono es requerido';
    if (!customerInfo.address.trim()) e.address = 'La dirección es requerida';
    if (!customerInfo.district) e.district = 'Selecciona un distrito';
    if (selectedPayment === 'credit') {
      if (!cardInfo.cardNumber.replace(/\s/g, '')) e.cardNumber = 'Número de tarjeta requerido';
      else if (cardInfo.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'Número de tarjeta inválido';
      if (!cardInfo.expiryDate) e.expiryDate = 'Fecha de expiración requerida';
      if (!cardInfo.cvv) e.cvv = 'CVV requerido';
      else if (cardInfo.cvv.length !== 3) e.cvv = 'CVV inválido';
      if (!cardInfo.cardName.trim()) e.cardName = 'Nombre en la tarjeta requerido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitToFormspree = async (formData) => {
    setFormState({ submitting: true, succeeded: false, error: null });
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    setFormState({ submitting: false, succeeded: true, error: null });
    return data;
  };

  const generateReceipt = () => ({
    receiptNumber: `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    receiptDate: new Date().toLocaleDateString('es-PE'),
    receiptAmount: getTotalPrice ? getTotalPrice().toFixed(2) : '0.00',
    bankName: selectedPayment === 'yape' ? 'Yape' :
              selectedPayment === 'transfer' ? 'Transferencia Bancaria' :
              selectedPayment === 'credit' ? 'Tarjeta de Crédito/Débito' : 'Efectivo',
  });

  const downloadReceipt = () => {
    const r = generateReceipt();
    const text = `COMPROBANTE DE PAGO - SPORTA\n=====================================\nNúmero: ${r.receiptNumber}\nFecha: ${r.receiptDate}\nMétodo: ${r.bankName}\nTotal: S/ ${r.receiptAmount}\n\nCliente: ${customerInfo.name}\nEmail: ${customerInfo.email}\nTeléfono: ${customerInfo.phone}\nDirección: ${customerInfo.address}, ${customerInfo.district}\n\nPEDIDO:\n${cartItems.map(i => `${i.name} x${i.quantity} - S/ ${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\nTOTAL: S/ ${r.receiptAmount}\n\n¡Gracias por tu compra!`.trim();
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = `comprobante-${r.receiptNumber}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    // Prevenir doble envío
    if (isProcessing || formState.submitting) {
      console.log('⚠️ Ya se está procesando un pedido');
      return;
    }
    
    if (!selectedPayment) { setFormError('Por favor selecciona un método de pago'); return; }
    if (!validateForm()) { setFormError('Por favor corrige los errores en el formulario'); return; }
    
    setIsProcessing(true); 
    setFormState({ submitting: true, succeeded: false, error: null });
    setFormError('');
    
    try {
      const r = generateReceipt();
      
      // Preparar datos del pedido para el backend
      const orderData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        district: customerInfo.district,
        reference: customerInfo.reference || '',
        delivery_notes: customerInfo.deliveryNotes || '',
        payment_method: selectedPayment,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.image_url,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        }))
      };

      // Guardar en la base de datos
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('sporta_token');
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pedido');
      }

      const result = await response.json();
      console.log('✅ Pedido guardado en la base de datos:', result);

      // También enviar a Formspree (opcional, como respaldo) - NO esperar respuesta
      const formData = {
        _subject: `🛍️ Nuevo Pedido #${result.order.id} - SPORTA`,
        _replyto: customerInfo.email,
        _template: 'table',
        _format: 'html',
        
        // Información del pedido
        'Número de Pedido': `#${result.order.id}`,
        'Comprobante': r.receiptNumber,
        'Fecha': r.receiptDate,
        'Estado': '✅ Confirmado',
        
        // Información del cliente
        '👤 Cliente': customerInfo.name,
        '📧 Email': customerInfo.email,
        '📱 Teléfono': customerInfo.phone,
        '📍 Dirección': `${customerInfo.address}, ${customerInfo.district}`,
        '🗺️ Referencia': customerInfo.reference || 'Sin referencia',
        '📝 Notas de entrega': customerInfo.deliveryNotes || 'Sin notas',
        
        // Información de pago
        '💳 Método de Pago': selectedPayment === 'credit' ? 'Tarjeta de Crédito/Débito' :
                             selectedPayment === 'yape' ? 'Yape/Plin' :
                             selectedPayment === 'transfer' ? 'Transferencia Bancaria' : 'Efectivo',
        
        // Productos
        '🛒 Productos': cartItems.map(i => 
          `${i.name} x${i.quantity} = S/ ${(i.price * i.quantity).toFixed(2)}`
        ).join('\n'),
        
        // Totales
        '💰 Subtotal': `S/ ${(getTotalPrice() - (getTotalPrice() >= 150 ? 0 : 15)).toFixed(2)}`,
        '🚚 Envío': getTotalPrice() >= 150 ? 'GRATIS' : 'S/ 15.00',
        '✨ TOTAL': `S/ ${getTotalPrice().toFixed(2)}`,
        
        // Información adicional
        '📅 Fecha del pedido': new Date().toLocaleString('es-PE', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        }),
        '⏰ Tiempo estimado de entrega': '2-3 días hábiles',
      };
      
      // Enviar a Formspree en segundo plano (no esperar)
      submitToFormspree(formData).catch(err => {
        console.warn('Formspree falló, pero el pedido se guardó en la BD:', err);
      });

      // Mostrar confirmación inmediatamente
      setOrderCompleted(true);
      if (onOrderComplete) onOrderComplete();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setFormError(error.message || 'Hubo un error procesando tu pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── STYLES ───────────────────────────────────────────────
  const S = {
    root:        { background:'#080808', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif", color:'#fff', padding:'2rem' },
    header:      { maxWidth:1200, margin:'0 auto 2.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', paddingTop:'1rem' },
    h1:          { fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,5vw,3.2rem)', letterSpacing:2, margin:0 },
    backBtn:     { display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', padding:'.6rem 1.2rem', borderRadius:10, cursor:'pointer' },
    errBanner:   { maxWidth:1200, margin:'0 auto 1.5rem', background:'rgba(255,60,60,.1)', border:'1px solid rgba(255,60,60,.3)', borderRadius:10, padding:'.85rem 1.25rem', color:'#ff6b6b', fontSize:'.875rem' },
    warnBanner:  { maxWidth:1200, margin:'0 auto 1.5rem', background:'rgba(255,165,0,.1)', border:'1px solid rgba(255,165,0,.25)', borderRadius:10, padding:'.85rem 1.25rem', color:'#ffb347', fontSize:'.875rem' },
    grid:        { maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:'1.75rem' },
    card:        { background:'#111', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'2rem', position:'relative', overflow:'hidden' },
    cardAccent:  { position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#FF4500,transparent)' },
    secHead:     { display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem', color:'rgba(255,255,255,.5)' },
    secTitle:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', letterSpacing:2, color:'#fff', margin:0 },
    formRow:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' },
    formGroup:   { display:'flex', flexDirection:'column', gap:6, marginBottom:'1rem' },
    label:       { fontSize:'.72rem', fontWeight:600, letterSpacing:.5, textTransform:'uppercase', color:'rgba(255,255,255,.35)', display:'flex', alignItems:'center', gap:5 },
    input:       { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', padding:'.72rem 1rem', outline:'none', transition:'border-color .2s' },
    inputErr:    { border:'1px solid rgba(255,60,60,.5)' },
    select:      { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', padding:'.72rem 1rem', outline:'none', appearance:'none' },
    errMsg:      { color:'#ff6b6b', fontSize:'.72rem', marginTop:2 },
    delivInfo:   { display:'flex', gap:'1.5rem', marginTop:'1.25rem', padding:'1rem', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12 },
    delivItem:   { display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.4)', fontSize:'.82rem' },
    // order summary
    orderItems:  { display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1rem' },
    orderItem:   { display:'flex', alignItems:'center', gap:12, padding:'.85rem', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12 },
    orderImg:    { width:52, height:52, borderRadius:8, objectFit:'cover', background:'rgba(255,255,255,.05)' },
    orderName:   { fontWeight:600, fontSize:'.88rem', marginBottom:2 },
    orderMeta:   { color:'rgba(255,255,255,.35)', fontSize:'.78rem' },
    orderPrice:  { marginLeft:'auto', color:'#FF4500', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', letterSpacing:1 },
    totalRow:    { display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,.08)' },
    totalLabel:  { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', letterSpacing:2, color:'rgba(255,255,255,.5)' },
    totalVal:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', letterSpacing:1, color:'#FF4500' },
    emptyCart:   { textAlign:'center', padding:'2rem', color:'rgba(255,255,255,.25)' },
    // payment
    payMethods:  { display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1.5rem' },
    payOption:   (sel) => ({ display:'flex', alignItems:'center', gap:14, padding:'1rem 1.25rem', background: sel ? 'rgba(255,69,0,.08)' : 'rgba(255,255,255,.03)', border: sel ? '1px solid rgba(255,69,0,.4)' : '1px solid rgba(255,255,255,.07)', borderRadius:12, cursor:'pointer', transition:'all .2s' }),
    payIcon:     { color:'#FF4500' },
    payTitle:    { fontWeight:600, fontSize:'.9rem', margin:0 },
    payDesc:     { color:'rgba(255,255,255,.35)', fontSize:'.78rem', margin:0 },
    radioCircle: (sel) => ({ marginLeft:'auto', width:18, height:18, borderRadius:'50%', border: sel ? '2px solid #FF4500' : '2px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }),
    radioDot:    { width:8, height:8, borderRadius:'50%', background:'#FF4500' },
    payBtn:      (dis) => ({ width:'100%', background: dis ? '#2a2a2a' : '#FF4500', color: dis ? 'rgba(255,255,255,.3)' : '#fff', border:'none', padding:'1rem', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', fontWeight:700, letterSpacing:'.75px', textTransform:'uppercase', cursor: dis ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:'1.5rem', transition:'all .2s' }),
    // payment details card
    detCard:     { background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'1.5rem', marginBottom:'1rem' },
    detHead:     { display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem', color:'rgba(255,255,255,.7)' },
    detTitle:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1rem', letterSpacing:2, margin:0 },
    walletItem:  { display:'flex', justifyContent:'space-between', padding:'.6rem 0', borderBottom:'1px solid rgba(255,255,255,.06)', fontSize:'.88rem' },
    bankItem:    { padding:'.75rem', background:'rgba(255,255,255,.03)', borderRadius:10, marginBottom:'.5rem' },
    bankLabel:   { fontSize:'.7rem', color:'rgba(255,255,255,.35)', letterSpacing:1, textTransform:'uppercase', marginBottom:2 },
    bankVal:     { fontFamily:'monospace', fontSize:'.9rem', color:'#fff' },
    cashFeats:   { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginTop:'1rem' },
    cashFeat:    { textAlign:'center', padding:'.85rem', background:'rgba(255,255,255,.03)', borderRadius:10 },
    cashFeatTit: { display:'block', fontSize:'.78rem', fontWeight:600, marginBottom:4 },
    cashFeatSub: { display:'block', fontSize:'.72rem', color:'rgba(255,255,255,.35)' },
    // success
    successWrap: { maxWidth:600, margin:'4rem auto', padding:'0 2rem', textAlign:'center' },
    successBox:  { background:'#111', border:'1px solid rgba(255,255,255,.08)', borderRadius:24, padding:'3rem 2.5rem', position:'relative', overflow:'hidden' },
    successIcon: { color:'#4ade80', margin:'0 auto 1.5rem' },
    successH2:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.2rem', letterSpacing:2, marginBottom:'1.5rem' },
    receiptBox:  { background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'1.25rem', marginBottom:'1.5rem', textAlign:'left' },
    receiptRow:  { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.5rem 0', borderBottom:'1px solid rgba(255,255,255,.06)', fontSize:'.875rem', color:'rgba(255,255,255,.5)' },
    detailsList: { display:'flex', flexDirection:'column', gap:'.6rem', marginBottom:'1.5rem', textAlign:'left' },
    detailItem:  { display:'flex', alignItems:'center', gap:10, fontSize:'.875rem', color:'rgba(255,255,255,.5)' },
    successMsg:  { color:'rgba(255,255,255,.4)', fontSize:'.875rem', lineHeight:1.7, marginBottom:'2rem' },
    successActs: { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' },
    dlBtn:       { display:'flex', alignItems:'center', gap:8, background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.25)', color:'#4ade80', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:700, padding:'.75rem 1.5rem', borderRadius:10, cursor:'pointer' },
    contBtn:     { display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.6)', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:600, padding:'.75rem 1.5rem', borderRadius:10, cursor:'pointer' },
    spinner:     { width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin .7s linear infinite' },
  };

  // ─── SUCCESS SCREEN ────────────────────────────────────────
  if (orderCompleted || formState.succeeded) {
    const r = generateReceipt();
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={S.root}>
          <div style={S.successWrap}>
            <div style={S.successBox}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#4ade80,transparent)' }}/>
              <div style={S.successIcon}><CheckCircle size={64}/></div>
              <h2 style={S.successH2}>¡PEDIDO CONFIRMADO!</h2>

              <div style={S.receiptBox}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', color:'rgba(255,255,255,.6)' }}>
                  <FileText size={18}/><span style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2, fontSize:'.95rem' }}>COMPROBANTE GENERADO</span>
                </div>
                {[['Número', r.receiptNumber],['Fecha', r.receiptDate],['Método', r.bankName],['Total', `S/ ${r.receiptAmount}`]].map(([k,v]) => (
                  <div key={k} style={S.receiptRow}><span>{k}</span><strong style={{ color:'#fff' }}>{v}</strong></div>
                ))}
              </div>

              <div style={S.detailsList}>
                {[
                  [<User size={16}/>, customerInfo.name, 'Cliente'],
                  [<Mail size={16}/>, customerInfo.email, 'Email'],
                  [<Phone size={16}/>, customerInfo.phone, 'Teléfono'],
                  [<MapPin size={16}/>, `${customerInfo.address}, ${customerInfo.district}`, 'Dirección'],
                  [<Truck size={16}/>, '2-3 días hábiles', 'Envío'],
                ].map(([icon, val, key]) => (
                  <div key={key} style={S.detailItem}>{icon}<span>{val}</span></div>
                ))}
              </div>

              <p style={S.successMsg}>Tu pedido ha sido procesado. Descarga tu comprobante a continuación.</p>

              <div style={S.successActs}>
                <button style={S.dlBtn} onClick={downloadReceipt}><Download size={16}/>Descargar comprobante</button>
                <button style={S.contBtn} onClick={() => {
                  // Cerrar checkout y volver al inicio
                  window.location.href = '/';
                }}><ShoppingCart size={16}/>Volver a la tienda</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── PAYMENT DETAILS ──────────────────────────────────────
  const renderPaymentDetails = () => {
    if (!selectedPayment) return null;
    return (
      <div style={S.detCard}>
        {selectedPayment === 'credit' && (
          <>
            <div style={S.detHead}><CardIcon size={20}/><h4 style={S.detTitle}>INFORMACIÓN DE TARJETA</h4></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div style={{ ...S.formGroup, gridColumn:'1/-1' }}>
                <label style={S.label}><CreditCard size={14}/>Número de Tarjeta</label>
                <input style={{ ...S.input, ...(errors.cardNumber ? S.inputErr : {}) }} name="cardNumber" value={cardInfo.cardNumber} onChange={handleCardInputChange} placeholder="1234 5678 9012 3456" maxLength="19"/>
                {errors.cardNumber && <span style={S.errMsg}>{errors.cardNumber}</span>}
              </div>
              <div style={S.formGroup}>
                <label style={S.label}><Calendar size={14}/>Expiración</label>
                <input style={{ ...S.input, ...(errors.expiryDate ? S.inputErr : {}) }} name="expiryDate" value={cardInfo.expiryDate} onChange={handleCardInputChange} placeholder="MM/AA" maxLength="5"/>
                {errors.expiryDate && <span style={S.errMsg}>{errors.expiryDate}</span>}
              </div>
              <div style={S.formGroup}>
                <label style={S.label}><Shield size={14}/>CVV</label>
                <input style={{ ...S.input, ...(errors.cvv ? S.inputErr : {}) }} name="cvv" value={cardInfo.cvv} onChange={handleCardInputChange} placeholder="123" maxLength="3"/>
                {errors.cvv && <span style={S.errMsg}>{errors.cvv}</span>}
              </div>
              <div style={{ ...S.formGroup, gridColumn:'1/-1' }}>
                <label style={S.label}><UserCheck size={14}/>Nombre en la Tarjeta</label>
                <input style={{ ...S.input, ...(errors.cardName ? S.inputErr : {}) }} name="cardName" value={cardInfo.cardName} onChange={handleCardInputChange} placeholder="Como aparece en la tarjeta"/>
                {errors.cardName && <span style={S.errMsg}>{errors.cardName}</span>}
              </div>
            </div>
          </>
        )}
        {selectedPayment === 'yape' && (
          <>
            <div style={S.detHead}><Smartphone size={20}/><h4 style={S.detTitle}>PAGO CON YAPE / PLIN</h4></div>
            {[['Número Yape', '+51 999 888 777'],['Número Plin', '+51 999 888 777'],['Nombre', 'SPORTA OFFICIAL']].map(([k,v]) => (
              <div key={k} style={S.walletItem}><strong style={{ color:'rgba(255,255,255,.6)', fontSize:'.82rem' }}>{k}</strong><span style={{ color:'#fff' }}>{v}</span></div>
            ))}
            <p style={{ marginTop:'1rem', color:'rgba(255,255,255,.35)', fontSize:'.82rem' }}>Tu comprobante se generará automáticamente al confirmar.</p>
          </>
        )}
        {selectedPayment === 'transfer' && (
          <>
            <div style={S.detHead}><Landmark size={20}/><h4 style={S.detTitle}>TRANSFERENCIA BANCARIA</h4></div>
            {[['BCP – Soles','191-23456789-0-45'],['Interbank – Soles','898-3100001234'],['BBVA – Soles','0011-0234-0200057891']].map(([bank,num]) => (
              <div key={bank} style={S.bankItem}>
                <div style={S.bankLabel}>{bank} · SPORTA S.A.C.</div>
                <div style={S.bankVal}>{num}</div>
              </div>
            ))}
            <p style={{ marginTop:'.75rem', color:'rgba(255,255,255,.35)', fontSize:'.82rem' }}>Envíanos el comprobante de transferencia para procesar tu pedido.</p>
          </>
        )}
        {selectedPayment === 'cash' && (
          <>
            <div style={S.detHead}><Banknote size={20}/><h4 style={S.detTitle}>PAGO CONTRA ENTREGA</h4></div>
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.875rem' }}>Paga en efectivo cuando recibas tu pedido.</p>
            <div style={S.cashFeats}>
              {[['💵','Efectivo','Soles exactos'],['📦','Al recibir','Revisa antes de pagar'],['🚚','Delivery','2-3 días hábiles']].map(([e,t,s]) => (
                <div key={t} style={S.cashFeat}><span style={{ fontSize:'1.5rem' }}>{e}</span><span style={S.cashFeatTit}>{t}</span><span style={S.cashFeatSub}>{s}</span></div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const isDisabled = cartItems.length === 0 || isProcessing || formState.submitting;

  // ─── MAIN FORM ────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}
        input:focus,select:focus{outline:none;border-color:rgba(255,69,0,.5)!important;background:rgba(255,69,0,.04)!important;}
        input::placeholder{color:rgba(255,255,255,.2);}
        .pay-opt:hover{border-color:rgba(255,69,0,.3)!important;}
        .pay-btn-main:hover:not(:disabled){background:#e03d00!important;transform:translateY(-2px);box-shadow:0 12px 28px rgba(255,69,0,.35);}
      `}</style>
      <div style={S.root}>

        {/* Header */}
        <div style={S.header}>
          <h1 style={S.h1}>FINALIZAR COMPRA</h1>
          <button style={S.backBtn} onClick={onReturnToCart}><ArrowLeft size={15}/>Volver al carrito</button>
        </div>

        {formError && <div style={S.errBanner}>{formError}</div>}
        {formState.error && <div style={S.warnBanner}>⚠️ No se pudo conectar con el servidor, pero puedes continuar con tu pedido.</div>}

        <div style={S.grid}>

          {/* ── CUSTOMER INFO ── */}
          <div style={S.card}>
            <div style={S.cardAccent}/>
            <div style={S.secHead}><User size={20}/><h3 style={S.secTitle}>INFORMACIÓN DE CONTACTO Y ENVÍO</h3></div>

            <div style={S.formRow}>
              {[['name','text','Nombre completo *',<User size={14}/>,'Ingresa tu nombre completo'],['email','email','Correo electrónico *',<Mail size={14}/>,'tu@email.com']].map(([name,type,label,icon,ph]) => (
                <div key={name} style={S.formGroup}>
                  <label style={S.label}>{icon}{label}</label>
                  <input type={type} name={name} value={customerInfo[name]} onChange={handleInputChange} placeholder={ph} style={{ ...S.input, ...(errors[name] ? S.inputErr : {}) }}/>
                  {errors[name] && <span style={S.errMsg}>{errors[name]}</span>}
                </div>
              ))}
            </div>

            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}><Phone size={14}/>Teléfono *</label>
                <input type="tel" name="phone" value={customerInfo.phone} onChange={handleInputChange} placeholder="+51 999 888 777" style={{ ...S.input, ...(errors.phone ? S.inputErr : {}) }}/>
                {errors.phone && <span style={S.errMsg}>{errors.phone}</span>}
              </div>
              <div style={S.formGroup}>
                <label style={S.label}><MapPin size={14}/>Distrito *</label>
                <select name="district" value={customerInfo.district} onChange={handleInputChange} style={{ ...S.select, ...(errors.district ? S.inputErr : {}) }} className="checkout-district-select">
                  <option value="">Selecciona tu distrito</option>
                  {[
                    'Ancón','Ate','Barranco','Breña','Carabayllo','Chaclacayo','Chorrillos','Cieneguilla','Comas',
                    'El Agustino','Independencia','Jesús María','La Molina','La Victoria','Lima','Lince','Los Olivos',
                    'Lurigancho','Lurín','Magdalena del Mar','Miraflores','Pachacámac','Pucusana','Pueblo Libre',
                    'Puente Piedra','Punta Hermosa','Punta Negra','Rímac','San Bartolo','San Borja','San Isidro',
                    'San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martín de Porres','San Miguel',
                    'Santa Anita','Santa María del Mar','Santa Rosa','Santiago de Surco','Surquillo','Villa El Salvador',
                    'Villa María del Triunfo'
                  ].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <span style={S.errMsg}>{errors.district}</span>}
              </div>
            </div>

            <div style={S.formGroup}>
              <label style={S.label}><MapPin size={14}/>Dirección completa *</label>
              <input type="text" name="address" value={customerInfo.address} onChange={handleInputChange} placeholder="Calle, número, departamento, urbanización" style={{ ...S.input, ...(errors.address ? S.inputErr : {}) }}/>
              {errors.address && <span style={S.errMsg}>{errors.address}</span>}
            </div>

            <div style={S.formRow}>
              {[['reference','Referencia de la dirección','Frente al parque...'],['deliveryNotes','Indicaciones de entrega','Timbre azul, dejar con conserje']].map(([name,label,ph]) => (
                <div key={name} style={S.formGroup}>
                  <label style={S.label}>{label}</label>
                  <input type="text" name={name} value={customerInfo[name]} onChange={handleInputChange} placeholder={`Ej: ${ph}`} style={S.input}/>
                </div>
              ))}
            </div>

            <div style={S.delivInfo}>
              <div style={S.delivItem}><Truck size={16} color="#FF4500"/><span>Envío estándar: 2-3 días hábiles</span></div>
              <div style={S.delivItem}><Clock size={16} color="#FF4500"/><span>Horario: 9:00 AM – 7:00 PM</span></div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div style={S.card}>
            <div style={S.cardAccent}/>
            <div style={S.secHead}><ShoppingCart size={20}/><h3 style={S.secTitle}>RESUMEN DEL PEDIDO</h3></div>
            <div style={S.orderItems}>
              {cartItems.length === 0 ? (
                <div style={S.emptyCart}><ShoppingCart size={40}/><p>No hay productos en el carrito</p></div>
              ) : cartItems.map(item => (
                <div key={item.id} style={S.orderItem}>
                  <img src={item.image} alt={item.name} style={S.orderImg}/>
                  <div>
                    <div style={S.orderName}>{item.name}</div>
                    <div style={S.orderMeta}>Cant: {item.quantity} · S/ {item.price} c/u</div>
                  </div>
                  <span style={S.orderPrice}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={S.totalRow}>
              <span style={S.totalLabel}>TOTAL</span>
              <span style={S.totalVal}>S/ {getTotalPrice ? getTotalPrice().toFixed(2) : '0.00'}</span>
            </div>
          </div>

          {/* ── PAYMENT ── (spans full width) */}
          <div style={{ ...S.card, gridColumn:'1 / -1' }}>
            <div style={S.cardAccent}/>
            <div style={S.secHead}><CreditCard size={20}/><h3 style={S.secTitle}>MÉTODO DE PAGO</h3></div>

            <div style={S.payMethods}>
              {[
                ['credit', <CreditCard size={22}/>, 'Tarjeta de Crédito/Débito', 'Pago inmediato – Comprobante automático'],
                ['yape',   <Smartphone size={22}/>,  'Yape / Plin',               'Comprobante automático por correo'],
                ['transfer',<Landmark size={22}/>,   'Transferencia Bancaria',    'Comprobante automático por correo'],
                ['cash',   <Banknote size={22}/>,    'Pago contra entrega',       'Paga en efectivo al recibir'],
              ].map(([val, icon, title, desc]) => (
                <div key={val} className="pay-opt" style={S.payOption(selectedPayment === val)} onClick={() => setSelectedPayment(val)}>
                  <span style={S.payIcon}>{icon}</span>
                  <div><p style={S.payTitle}>{title}</p><p style={S.payDesc}>{desc}</p></div>
                  <div style={S.radioCircle(selectedPayment === val)}>
                    {selectedPayment === val && <div style={S.radioDot}/>}
                  </div>
                </div>
              ))}
            </div>

            {renderPaymentDetails()}

            <button
              className="pay-btn-main"
              style={S.payBtn(isDisabled)}
              onClick={handlePayment}
              disabled={isDisabled}
            >
              {isProcessing || formState.submitting ? (
                <><div style={S.spinner}/>{formState.submitting ? 'Enviando...' : 'Procesando pago...'}</>
              ) : (
                <><Shield size={18}/>Confirmar Pedido – S/ {getTotalPrice ? getTotalPrice().toFixed(2) : '0.00'}</>
              )}
            </button>
          </div>

        </div>
      </div>
      
      {/* Estilos adicionales para el selector de distrito */}
      <style>{`
        .checkout-district-select option {
          background: #111 !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
};

export default Checkout;