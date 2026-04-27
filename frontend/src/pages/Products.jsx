import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { api } from '../api'

const Products = ({ addToCart, viewProductDetail, user, onShowAuth }) => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await api.getProducts()
      if (res.products) {
        setProducts(res.products)
      }
    } catch (err) {
      console.error('Error cargando productos:', err)
    }
    setLoading(false)
  }

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const categoryLabels = { all:'Todos', running:'Running', lifestyle:'Lifestyle', basketball:'Basketball' }

  let filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => activeCategory === 'all' || p.category === activeCategory)

  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sortBy === 'name')       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name))

  return (
    <>
      <style>{`
        .prod-root { background:#080808; min-height:100vh; font-family:'DM Sans',sans-serif; }

        /* HEAD */
        .prod-head {
          padding:4.5rem 2rem 3rem; background:#0d0d0d;
          border-bottom:1px solid rgba(255,255,255,.06);
          position:relative; overflow:hidden;
        }
        .prod-head::before {
          content:''; position:absolute;
          width:500px; height:400px;
          background:radial-gradient(circle,rgba(255,69,0,.09) 0%,transparent 70%);
          top:-150px; right:-100px; pointer-events:none;
        }
        .prod-head-inner { max-width:1200px; margin:0 auto; }
        .prod-eyebrow {
          display:inline-flex; align-items:center; gap:.5rem;
          background:rgba(255,69,0,.1); border:1px solid rgba(255,69,0,.2);
          border-radius:50px; padding:.3rem .9rem;
          font-size:.7rem; letter-spacing:2px; text-transform:uppercase;
          color:#FF4500; font-weight:600; margin-bottom:1rem;
        }
        .prod-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2.5rem,6vw,4.5rem); letter-spacing:2px;
          line-height:.95; color:#fff; margin-bottom:.75rem;
        }
        .prod-title span { color:#FF4500; }
        .prod-sub { color:rgba(255,255,255,.35); font-size:.9rem; max-width:500px; line-height:1.6; }

        /* LOGIN GATE */
        .prod-gate {
          max-width:600px; margin:4rem auto; padding:0 2rem; text-align:center;
        }
        .prod-gate-box {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
          border-radius:24px; padding:3.5rem 2.5rem;
          position:relative; overflow:hidden;
        }
        .prod-gate-box::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,#FF4500,transparent);
        }
        .prod-gate-icon {
          width:70px; height:70px;
          background:rgba(255,69,0,.1); border:1px solid rgba(255,69,0,.2);
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          color:#FF4500; margin:0 auto 1.5rem;
        }
        .prod-gate-box h2 {
          font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:2px;
          color:#fff; margin-bottom:.75rem;
        }
        .prod-gate-box p { color:rgba(255,255,255,.4); font-size:.9rem; line-height:1.7; margin-bottom:2rem; }
        .prod-gate-btn {
          background:#FF4500; color:#fff; border:none;
          padding:.85rem 2.5rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.875rem;
          font-weight:700; letter-spacing:.5px; text-transform:uppercase;
          cursor:pointer; transition:all .2s;
        }
        .prod-gate-btn:hover { background:#e03d00; transform:translateY(-2px); box-shadow:0 12px 28px rgba(255,69,0,.35); }

        /* FILTERS */
        .prod-filters {
          max-width:1200px; margin:0 auto; padding:2rem 2rem 0;
          display:flex; gap:1rem; flex-wrap:wrap; align-items:center;
        }
        .prod-search {
          position:relative; flex:1; min-width:220px; max-width:340px;
        }
        .prod-search svg { position:absolute; left:1rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.3); pointer-events:none; }
        .prod-search input {
          width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          border-radius:10px; color:#fff; font-family:'DM Sans',sans-serif; font-size:.875rem;
          padding:.7rem 1rem .7rem 2.75rem; transition:all .2s;
        }
        .prod-search input:focus { outline:none; border-color:rgba(255,69,0,.4); background:rgba(255,69,0,.04); }
        .prod-search input::placeholder { color:rgba(255,255,255,.2); }
        .prod-cats { display:flex; gap:.4rem; flex-wrap:wrap; }
        .prod-cat-btn {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.5); font-family:'DM Sans',sans-serif;
          font-size:.78rem; font-weight:500; padding:.45rem 1rem; border-radius:8px;
          cursor:pointer; transition:all .2s;
        }
        .prod-cat-btn.on {
          background:rgba(255,69,0,.15); border-color:rgba(255,69,0,.4);
          color:#FF4500;
        }
        .prod-cat-btn:hover:not(.on) { color:#fff; border-color:rgba(255,255,255,.2); }
        .prod-sort {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.5); font-family:'DM Sans',sans-serif; font-size:.78rem;
          padding:.45rem 1rem; border-radius:8px; cursor:pointer; transition:all .2s;
          appearance:none; outline:none; min-width:140px;
        }
        .prod-sort:focus { border-color:rgba(255,69,0,.4); color:#fff; }
        .prod-sort option { background:#111; color:#fff; }

        /* RESULTS */
        .prod-results-bar {
          max-width:1200px; margin:0 auto;
          padding:1.25rem 2rem .25rem;
          display:flex; align-items:center; justify-content:space-between;
        }
        .prod-count { color:rgba(255,255,255,.3); font-size:.8rem; }
        .prod-count strong { color:rgba(255,255,255,.6); }

        /* GRID */
        .prod-grid {
          max-width:1200px; margin:0 auto;
          padding:1.5rem 2rem 5rem;
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(290px,1fr));
          gap:1.5rem;
        }

        /* EMPTY */
        .prod-empty {
          max-width:400px; margin:5rem auto; text-align:center; padding:0 2rem;
        }
        .prod-empty svg { color:rgba(255,255,255,.12); margin-bottom:1rem; }
        .prod-empty h3 { color:rgba(255,255,255,.5); font-size:1rem; font-weight:500; margin-bottom:.4rem; }
        .prod-empty p  { color:rgba(255,255,255,.25); font-size:.85rem; }

        @media(max-width:768px) {
          .prod-filters { flex-direction:column; align-items:stretch; }
          .prod-search { max-width:100%; }
        }
      `}</style>

      <div className="prod-root">
        {/* Head */}
        <div className="prod-head">
          <div className="prod-head-inner">
            <div className="prod-eyebrow">Colección 2025</div>
            <h1 className="prod-title">NUESTROS<br/><span>PRODUCTOS</span></h1>
            <p className="prod-sub">Equipamiento diseñado para atletas que no aceptan límites. Elige tu arma.</p>
          </div>
        </div>

        {!user ? (
          /* Gate — requiere login */
          <div className="prod-gate">
            <div className="prod-gate-box">
              <div className="prod-gate-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>ACCESO EXCLUSIVO</h2>
              <p>Inicia sesión para explorar toda nuestra colección de equipamiento deportivo premium y acceder a precios exclusivos para miembros.</p>
              <button className="prod-gate-btn" onClick={onShowAuth}>Iniciar sesión</button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="prod-filters">
              <div className="prod-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="prod-cats">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`prod-cat-btn ${activeCategory===cat?'on':''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {categoryLabels[cat] || cat}
                  </button>
                ))}
              </div>

              <select className="prod-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </div>

            {/* Count */}
            <div className="prod-results-bar">
              <span className="prod-count">
                <strong>{filtered.length}</strong> {filtered.length===1?'producto':'productos'} encontrados
              </span>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="prod-grid">
                {filtered.map(product => (
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
            ) : (
              <div className="prod-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <h3>Sin resultados</h3>
                <p>Intenta con otro término o categoría</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Products