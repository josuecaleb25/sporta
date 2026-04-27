import { useState } from 'react'

const ProductDetail = ({ product, addToCart, onBack, user, onShowAuth }) => {
  const [selectedSize, setSelectedSize]   = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity]           = useState(1)
  const [tab, setTab]                     = useState('info')

  if (!product) {
    return (
      <>
        <style>{`.pd-404{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;background:#080808;color:rgba(255,255,255,.4);font-family:'DM Sans',sans-serif;gap:1rem;} .pd-404 h2{color:#fff;font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:2px;}`}</style>
        <div className="pd-404">
          <h2>PRODUCTO NO ENCONTRADO</h2>
          <p>El producto que buscas no existe o fue eliminado.</p>
        </div>
      </>
    )
  }

  const sizes   = product.sizes   || ['38','39','40','41','42','43','44']
  const colors  = product.colors  || ['Negro','Blanco','Gris','Naranja']
  const features = product.features || [
    'Upper de malla técnica de alta respirabilidad',
    'Entresuela con tecnología de amortiguación reactiva',
    'Suela de goma de alta tracción para cualquier superficie',
    'Sistema de ajuste de precisión para soporte óptimo',
    'Diseño aerodinámico con refuerzo en zonas de impacto',
  ]
  const description = product.description || `${product.name} es parte de la colección premium de Sporta. Ingeniería de rendimiento al servicio del atleta moderno — donde la tecnología se encuentra con el estilo.`

  const handleAddToCart = () => {
    if (!user) { onShowAuth(); return }
    addToCart({ ...product, selectedSize: selectedSize||'Única', selectedColor: selectedColor||'Estándar', quantity })
  }

  const canAdd = selectedSize && selectedColor

  return (
    <>
      <style>{`
        .pd-root { background:#080808; min-height:100vh; font-family:'DM Sans',sans-serif; color:#fff; }

        /* BREADCRUMB */
        .pd-breadcrumb {
          max-width:1200px; margin:0 auto;
          padding:1.5rem 2rem .5rem;
          display:flex; align-items:center; gap:.5rem;
        }
        .pd-back {
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.5); padding:.45rem 1rem; border-radius:8px;
          font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500;
          cursor:pointer; transition:all .2s;
          display:flex; align-items:center; gap:.4rem;
        }
        .pd-back:hover { color:#fff; border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.08); }
        .pd-crumb-sep { color:rgba(255,255,255,.2); font-size:.8rem; }
        .pd-crumb-cur { color:rgba(255,255,255,.35); font-size:.8rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; }

        /* LAYOUT */
        .pd-inner {
          max-width:1200px; margin:0 auto;
          padding:2rem;
          display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start;
        }

        /* IMAGE */
        .pd-img-wrap {
          position:relative; border-radius:24px; overflow:hidden;
          background:linear-gradient(135deg,#111,#161616);
          border:1px solid rgba(255,255,255,.07);
          aspect-ratio:1;
        }
        .pd-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
        .pd-badge {
          position:absolute; top:1rem; left:1rem;
          background:#FF4500; color:#fff; font-size:.65rem; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase;
          padding:.3rem .8rem; border-radius:50px;
        }
        .pd-img-shine {
          position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 50%);
          pointer-events:none;
        }

        /* INFO */
        .pd-info { display:flex; flex-direction:column; gap:1.5rem; }
        .pd-cat {
          font-size:.68rem; letter-spacing:2px; text-transform:uppercase;
          color:#FF4500; font-weight:600;
        }
        .pd-name {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2.2rem,5vw,3.2rem); letter-spacing:2px;
          line-height:.95; color:#fff; margin:0;
        }
        .pd-price-row { display:flex; align-items:baseline; gap:.6rem; }
        .pd-price {
          font-family:'Bebas Neue',sans-serif; font-size:2.4rem;
          letter-spacing:1px; color:#FF4500;
        }
        .pd-price-label { color:rgba(255,255,255,.3); font-size:.8rem; }
        .pd-divider { height:1px; background:rgba(255,255,255,.07); }

        /* TABS */
        .pd-tabs { display:flex; gap:0; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:10px; padding:3px; }
        .pd-tab {
          flex:1; background:none; border:none; color:rgba(255,255,255,.4);
          font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:600;
          letter-spacing:.5px; text-transform:uppercase; padding:.45rem; border-radius:7px;
          cursor:pointer; transition:all .2s;
        }
        .pd-tab.on { background:rgba(255,255,255,.08); color:#fff; }
        .pd-tab-content { padding:.25rem 0; }

        /* Description */
        .pd-desc { color:rgba(255,255,255,.45); font-size:.9rem; line-height:1.75; font-weight:300; }
        .pd-features { display:flex; flex-direction:column; gap:.6rem; }
        .pd-feat {
          display:flex; align-items:flex-start; gap:.75rem;
          color:rgba(255,255,255,.55); font-size:.875rem; line-height:1.5;
        }
        .pd-feat-dot { width:6px; height:6px; border-radius:50%; background:#FF4500; margin-top:.45rem; flex-shrink:0; }

        /* SIZE */
        .pd-label { font-size:.7rem; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.3); font-weight:600; margin-bottom:.6rem; }
        .pd-sizes { display:flex; flex-wrap:wrap; gap:.5rem; }
        .pd-size-btn {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.55); padding:.55rem 1.1rem; border-radius:9px;
          font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
          cursor:pointer; transition:all .2s;
        }
        .pd-size-btn:hover { border-color:rgba(255,255,255,.2); color:#fff; }
        .pd-size-btn.on { background:rgba(255,69,0,.15); border-color:rgba(255,69,0,.5); color:#FF4500; }

        /* COLOR */
        .pd-colors { display:flex; flex-wrap:wrap; gap:.5rem; }
        .pd-color-btn {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.55); padding:.55rem 1.1rem; border-radius:9px;
          font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
          cursor:pointer; transition:all .2s;
        }
        .pd-color-btn:hover { border-color:rgba(255,255,255,.2); color:#fff; }
        .pd-color-btn.on { background:rgba(255,69,0,.15); border-color:rgba(255,69,0,.5); color:#FF4500; }

        /* PURCHASE */
        .pd-purchase {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;
        }
        .pd-qty-row { display:flex; align-items:center; justify-content:space-between; }
        .pd-qty-label { font-size:.78rem; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:rgba(255,255,255,.35); }
        .pd-qty-ctrl { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:9px; padding:.25rem .35rem; }
        .pd-qty-ctrl button {
          background:none; border:none; color:rgba(255,255,255,.6);
          width:28px; height:28px; border-radius:6px;
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; font-weight:700; cursor:pointer; transition:all .15s;
        }
        .pd-qty-ctrl button:hover:not(:disabled) { background:rgba(255,69,0,.2); color:#FF4500; }
        .pd-qty-ctrl button:disabled { color:rgba(255,255,255,.2); cursor:not-allowed; }
        .pd-qty-ctrl span { color:#fff; font-size:.9rem; font-weight:600; min-width:24px; text-align:center; }
        .pd-add-btn {
          background:#FF4500; color:#fff; border:none; padding:1rem;
          border-radius:11px; font-family:'DM Sans',sans-serif; font-size:.875rem;
          font-weight:700; letter-spacing:.75px; text-transform:uppercase;
          cursor:pointer; transition:all .25s;
          display:flex; align-items:center; justify-content:center; gap:.6rem;
        }
        .pd-add-btn:hover:not(:disabled) { background:#e03d00; transform:translateY(-2px); box-shadow:0 12px 28px rgba(255,69,0,.4); }
        .pd-add-btn:disabled { background:#1e1e1e; color:rgba(255,255,255,.25); cursor:not-allowed; }
        .pd-hint { font-size:.75rem; color:rgba(255,255,255,.25); text-align:center; }

        /* PERKS */
        .pd-perks { display:flex; flex-direction:column; gap:.6rem; }
        .pd-perk { display:flex; align-items:center; gap:.75rem; color:rgba(255,255,255,.35); font-size:.82rem; }
        .pd-perk svg { flex-shrink:0; color:rgba(255,69,0,.6); }

        @media(max-width:900px){
          .pd-inner { grid-template-columns:1fr; gap:2rem; }
        }
      `}</style>

      <div className="pd-root">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <button className="pd-back" onClick={onBack}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Productos
          </button>
          <span className="pd-crumb-sep">/</span>
          <span className="pd-crumb-cur">{product.name}</span>
        </div>

        <div className="pd-inner">
          {/* Imagen */}
          <div className="pd-img-wrap">
            <img src={product.image} alt={product.name}/>
            <div className="pd-img-shine"/>
            {product.badge && <span className="pd-badge">{product.badge}</span>}
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-cat">{product.category}</p>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-price-row">
              <span className="pd-price">S/ {product.price}</span>
              <span className="pd-price-label">Precio unitario</span>
            </div>

            <div className="pd-divider"/>

            {/* Tabs */}
            <div>
              <div className="pd-tabs">
                {[['info','Descripción'],['feats','Características']].map(([key,label]) => (
                  <button key={key} className={`pd-tab ${tab===key?'on':''}`} onClick={() => setTab(key)}>{label}</button>
                ))}
              </div>
              <div className="pd-tab-content" style={{marginTop:'1rem'}}>
                {tab === 'info' && <p className="pd-desc">{description}</p>}
                {tab === 'feats' && (
                  <div className="pd-features">
                    {features.map((f,i) => (
                      <div key={i} className="pd-feat">
                        <span className="pd-feat-dot"/>
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pd-divider"/>

            {/* Talla */}
            <div>
              <p className="pd-label">Talla {selectedSize && `— ${selectedSize}`}</p>
              <div className="pd-sizes">
                {sizes.map(s => (
                  <button key={s} className={`pd-size-btn ${selectedSize===s?'on':''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="pd-label">Color {selectedColor && `— ${selectedColor}`}</p>
              <div className="pd-colors">
                {colors.map(c => (
                  <button key={c} className={`pd-color-btn ${selectedColor===c?'on':''}`} onClick={() => setSelectedColor(c)}>{c}</button>
                ))}
              </div>
            </div>

            {/* Compra */}
            <div className="pd-purchase">
              <div className="pd-qty-row">
                <span className="pd-qty-label">Cantidad</span>
                <div className="pd-qty-ctrl">
                  <button onClick={() => setQuantity(q => Math.max(1,q-1))} disabled={quantity<=1}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)}>+</button>
                </div>
              </div>

              <button className="pd-add-btn" onClick={handleAddToCart} disabled={!canAdd}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {!canAdd ? 'Selecciona talla y color' : `Agregar · S/ ${(product.price * quantity).toFixed(2)}`}
              </button>

              {!canAdd && <p className="pd-hint">Debes seleccionar talla y color para continuar</p>}
            </div>

            {/* Perks */}
            <div className="pd-perks">
              {[
                ['Envío gratis en compras +S/ 150','truck'],
                ['Devoluciones gratis en 30 días','refresh'],
                ['Garantía de 2 años','shield'],
              ].map(([text, icon]) => (
                <div key={text} className="pd-perk">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {icon==='truck'    && <><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="9" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="21" r="1" fill="currentColor"/><circle cx="20" cy="21" r="1" fill="currentColor"/></>}
                    {icon==='refresh'  && <><polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>}
                    {icon==='shield'   && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail