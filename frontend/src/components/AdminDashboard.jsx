import { useState, useEffect, useRef } from 'react'
import { api } from '../api'

// ─── HELPERS ────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Enviado: 'badge-success', Pagado: 'badge-info',
    Pendiente: 'badge-warning', Activo: 'badge-success',
    Bloqueado: 'badge-danger', 'Bajo stock': 'badge-warning',
    'Sin stock': 'badge-danger', pending: 'badge-warning',
    paid: 'badge-info', shipped: 'badge-success', cancelled: 'badge-danger'
  }
  const label = status === 'pending' ? 'Pendiente' : status === 'paid' ? 'Pagado' : status === 'shipped' ? 'Enviado' : status === 'cancelled' ? 'Cancelado' : status
  return <span className={`adm-badge ${map[status] || 'badge-gray'}`}>{label}</span>
}

function Avatar({ name, size = 28 }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#FF4500', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 500, color: '#fff', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
const AdminDashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard')
  const [period, setPeriod] = useState('monthly')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [sales, setSales] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [salesTab, setSalesTab] = useState('all')
  const [prodSearch, setProdSearch] = useState('')
  const [prodCat, setProdCat] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState('')
  const [salesSearch, setSalesSearch] = useState('')
  const [salesStatusFilter, setSalesStatusFilter] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({ name: '', price: '', category: 'running', stock: '', badge: '', description: '', image: '', is_featured: false })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [reportFrom, setReportFrom] = useState('2025-01-01')
  const [reportTo, setReportTo] = useState('2025-12-31')
  const [reportType, setReportType] = useState('sales')

  const salesChartRef = useRef(null)
  const catChartRef = useRef(null)
  const reportChartRef = useRef(null)
  const salesChartInst = useRef(null)
  const catChartInst = useRef(null)
  const reportChartInst = useRef(null)

  // ─── CARGAR DATOS DEL BACKEND ─────────────────────────────
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.getProducts(),
        api.admin.getOrders()
      ])
      
      if (statsRes.stats) setStats(statsRes.stats)
      
      // Calcular pedidos y gastos por usuario
      const ordersByUser = {}
      if (ordersRes.orders) {
        ordersRes.orders.forEach(order => {
          if (order.user_id) {
            if (!ordersByUser[order.user_id]) {
              ordersByUser[order.user_id] = { count: 0, total: 0 }
            }
            ordersByUser[order.user_id].count++
            ordersByUser[order.user_id].total += parseFloat(order.total || 0)
          }
        })
      }
      
      if (usersRes.users) setUsers(usersRes.users.map(u => ({
        ...u,
        date: new Date(u.created_at).toLocaleDateString('es-PE'),
        orders: ordersByUser[u.id]?.count || 0,
        spent: ordersByUser[u.id]?.total || 0,
        status: u.role === 'admin' ? 'Admin' : u.blocked ? 'Bloqueado' : 'Activo'
      })))
      if (productsRes.products) setProducts(productsRes.products.map(p => ({
        ...p,
        emoji: p.category === 'running' ? '👟' : p.category === 'basketball' ? '🏀' : '🔥',
        status: p.stock === 0 ? 'Sin stock' : p.stock < 10 ? 'Bajo stock' : 'Activo'
      })))
      if (ordersRes.orders) setSales(ordersRes.orders.map(o => ({
        ...o,
        client: o.name || 'Cliente',
        date: new Date(o.created_at).toLocaleDateString('es-PE'),
        items: o.items?.map(i => i.name || 'Producto').join(', ') || 'N/A',
        payment: o.payment_method || 'N/A'
      })))
    } catch (err) {
      console.error('Error cargando datos:', err)
    }
    setLoading(false)
  }

  // Cargar Chart.js dinámicamente
  useEffect(() => {
    if (window.Chart) return
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    s.onload = () => { if (activePage === 'dashboard') initCharts() }
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (activePage === 'dashboard') setTimeout(initCharts, 150)
    if (activePage === 'reports') setTimeout(initReportChart, 150)
  }, [activePage, period, stats, sales])

  const destroyChart = (ref) => { if (ref.current) { ref.current.destroy(); ref.current = null } }

  function initCharts() {
    if (!window.Chart || !salesChartRef.current || !catChartRef.current || !stats) return

    // Preparar datos según período
    let chartData = { labels: [], sales: [], orders: [] }
    
    if (period === 'monthly' && stats.monthlyRevenue) {
      // Datos mensuales desde el backend
      chartData.labels = stats.monthlyRevenue.map(m => m.month)
      chartData.sales = stats.monthlyRevenue.map(m => m.revenue)
      chartData.orders = stats.monthlyRevenue.map(m => Math.floor(m.revenue / 400))
    } else if (period === 'daily') {
      // Calcular datos de los últimos 7 días desde las órdenes
      const today = new Date()
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        last7Days.push(date)
      }
      
      chartData.labels = last7Days.map(d => ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()])
      chartData.sales = last7Days.map(date => {
        const dayOrders = sales.filter(s => {
          const orderDate = new Date(s.created_at || s.date)
          return orderDate.toDateString() === date.toDateString()
        })
        return dayOrders.reduce((sum, s) => sum + parseFloat(s.total || 0), 0)
      })
      chartData.orders = last7Days.map(date => {
        return sales.filter(s => {
          const orderDate = new Date(s.created_at || s.date)
          return orderDate.toDateString() === date.toDateString()
        }).length
      })
    } else {
      // Calcular datos anuales desde las órdenes
      const currentYear = new Date().getFullYear()
      const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear]
      
      chartData.labels = years.map(y => y.toString())
      chartData.sales = years.map(year => {
        const yearOrders = sales.filter(s => {
          const orderDate = new Date(s.created_at || s.date)
          return orderDate.getFullYear() === year
        })
        return yearOrders.reduce((sum, s) => sum + parseFloat(s.total || 0), 0)
      })
      chartData.orders = years.map(year => {
        return sales.filter(s => {
          const orderDate = new Date(s.created_at || s.date)
          return orderDate.getFullYear() === year
        }).length
      })
    }

    destroyChart(salesChartInst)
    destroyChart(catChartInst)

    // Gráfico de barras de ventas
    salesChartInst.current = new window.Chart(salesChartRef.current, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          { label: 'Ingresos (S/)', data: chartData.sales, backgroundColor: '#FF4500', borderRadius: 4, yAxisID: 'y' },
          { label: 'Pedidos', data: chartData.orders, type: 'line', borderColor: '#94a3b8', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#94a3b8', yAxisID: 'y1', borderDash: [4, 4] },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { font: { size: 10 }, callback: v => 'S/' + Math.round(v / 1000) + 'k' }, grid: { color: 'rgba(150,150,150,0.1)' } },
          y1: { beginAtZero: true, position: 'right', ticks: { font: { size: 10 } }, grid: { display: false } },
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
        },
      },
    })

    // Gráfico de dona de categorías
    const catCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})
    const running = catCounts.running || 0
    const lifestyle = catCounts.lifestyle || 0
    const basketball = catCounts.basketball || 0
    const total = running + lifestyle + basketball || 1

    catChartInst.current = new window.Chart(catChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Running', 'Lifestyle', 'Basketball'],
        datasets: [{
          data: [Math.round(running / total * 100), Math.round(lifestyle / total * 100), Math.round(basketball / total * 100)],
          backgroundColor: ['#FF4500', '#3b82f6', '#22c55e'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }, 
        cutout: '65%' 
      },
    })
  }

  function initReportChart() {
    if (!window.Chart || !reportChartRef.current || !stats) return
    destroyChart(reportChartInst)
    const d = stats.monthlyRevenue || []
    reportChartInst.current = new window.Chart(reportChartRef.current, {
      type: 'line',
      data: {
        labels: d.map(m => m.month),
        datasets: [{
          label: 'Ingresos',
          data: d.map(m => m.revenue),
          borderColor: '#FF4500',
          backgroundColor: 'rgba(255,69,0,0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#FF4500',
          fill: true
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, ticks: { font: { size: 10 }, callback: v => 'S/' + Math.round(v / 1000) + 'k' }, grid: { color: 'rgba(150,150,150,0.1)' } },
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
        },
      },
    })
  }

  // ─── Products ─────────────────────────────────────────────
  const openProductModal = (product = null) => {
    setEditingProduct(product)
    setImageFile(null)
    setProductForm(product ? {
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      badge: product.badge || '',
      description: product.description || '',
      image: product.image || '',
      is_featured: product.is_featured || false
    } : { name: '', price: '', category: 'running', stock: '', badge: '', description: '', image: '', is_featured: false })
    setShowProductModal(true)
  }

  const handleImageUpload = async (file) => {
    if (!file) return null
    
    setUploadingImage(true)
    try {
      // Generar nombre único para la imagen
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Subir a Supabase Storage
      const { data, error } = await api.supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = api.supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setUploadingImage(false)
      return publicUrl
    } catch (err) {
      console.error('Error subiendo imagen:', err)
      alert('Error al subir la imagen. Intenta nuevamente.')
      setUploadingImage(false)
      return null
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB')
      return
    }

    setImageFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProductForm({ ...productForm, image: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const saveProduct = async () => {
    const { name, price, category, stock, badge, description, is_featured } = productForm
    if (!name.trim() || !price) return

    try {
      // Si hay una imagen nueva, subirla primero
      let imageUrl = productForm.image
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const productData = {
        name,
        price: parseFloat(price),
        category,
        stock: Number(stock),
        badge: badge || null,
        description: description || null,
        image: imageUrl || null,
        is_featured: is_featured || false
      }

      if (editingProduct) {
        const res = await api.admin.updateProduct(editingProduct.id, productData)
        if (res.product) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
            ...res.product,
            emoji: res.product.category === 'running' ? '👟' : res.product.category === 'basketball' ? '🏀' : '🔥',
            status: res.product.stock === 0 ? 'Sin stock' : res.product.stock < 10 ? 'Bajo stock' : 'Activo'
          } : p))
        }
      } else {
        const res = await api.admin.createProduct(productData)
        if (res.product) {
          setProducts(prev => [...prev, {
            ...res.product,
            emoji: res.product.category === 'running' ? '👟' : res.product.category === 'basketball' ? '🏀' : '🔥',
            status: res.product.stock === 0 ? 'Sin stock' : res.product.stock < 10 ? 'Bajo stock' : 'Activo'
          }])
        }
      }
      setShowProductModal(false)
      setImageFile(null)
    } catch (err) {
      console.error('Error guardando producto:', err)
      alert('Error al guardar el producto')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await api.admin.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error eliminando producto:', err)
      alert('Error al eliminar el producto')
    }
  }

  // ─── Users ────────────────────────────────────────────────
  const toggleUserStatus = async (id) => {
    const u = users.find(x => x.id === id)
    if (!u) return
    const newStatus = u.status === 'Bloqueado' ? 'Activo' : 'Bloqueado'
    try {
      await api.admin.updateUser(id, { blocked: newStatus === 'Bloqueado' })
      setUsers(prev => prev.map(user => user.id === id ? { ...user, status: newStatus } : user))
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, status: newStatus })
      }
    } catch (err) {
      console.error('Error actualizando usuario:', err)
      alert('Error al actualizar el usuario')
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    try {
      await api.admin.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      console.error('Error eliminando usuario:', err)
      alert('Error al eliminar el usuario')
    }
  }

  // ─── Sales ────────────────────────────────────────────────
  const advanceOrderStatus = async (id) => {
    const order = sales.find(s => s.id === id)
    if (!order) return
    let newStatus = order.status
    if (order.status === 'pending' || order.status === 'Pendiente') newStatus = 'paid'
    else if (order.status === 'paid' || order.status === 'Pagado') newStatus = 'shipped'
    else return

    try {
      await api.admin.updateOrderStatus(id, newStatus)
      setSales(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
      setShowOrderModal(false)
    } catch (err) {
      console.error('Error actualizando pedido:', err)
      alert('Error al actualizar el pedido')
    }
  }

  // ─── Reports ──────────────────────────────────────────────
  const generateReport = (format) => {
    let content = `SPORTA — REPORTE DE ${reportType.toUpperCase()}\nFecha: ${reportFrom} al ${reportTo}\n\n`
    if (reportType === 'sales') {
      content += 'Pedido,Cliente,Fecha,Total,Estado\n'
      sales.forEach(s => { content += `${s.id},${s.client},${s.date},${s.total},${s.status}\n` })
    } else if (reportType === 'users') {
      content += 'Nombre,Email,Pedidos,Total Gastado,Estado\n'
      users.forEach(u => { content += `${u.name},${u.email},${u.orders},${u.spent},${u.status}\n` })
    } else {
      content += 'Producto,Categoría,Precio,Stock,Estado\n'
      products.forEach(p => { content += `${p.name},${p.category},${p.price},${p.stock},${p.status}\n` })
    }
    const ext = format === 'pdf' ? 'txt' : 'csv'
    const mime = format === 'pdf' ? 'text/plain' : 'text/csv'
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `reporte-sporta-${reportType}.${ext}`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ─── Filtered data ────────────────────────────────────────
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) && (!prodCat || p.category === prodCat)
  )

  const filteredUsers = users.filter(u =>
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
    (!userStatusFilter || u.status === userStatusFilter)
  )

  const tabStatusMap = { all: null, pending: 'pending', paid: 'paid', shipped: 'shipped' }
  const filteredSales = sales.filter(s => {
    const tabOk = !tabStatusMap[salesTab] || s.status === tabStatusMap[salesTab] || 
                  (tabStatusMap[salesTab] === 'pending' && s.status === 'Pendiente') ||
                  (tabStatusMap[salesTab] === 'paid' && s.status === 'Pagado') ||
                  (tabStatusMap[salesTab] === 'shipped' && s.status === 'Enviado')
    const searchOk = !salesSearch || s.client.toLowerCase().includes(salesSearch.toLowerCase()) || s.id.toString().toLowerCase().includes(salesSearch.toLowerCase())
    const statusOk = !salesStatusFilter || s.status === salesStatusFilter
    return tabOk && searchOk && statusOk
  })

  const totalIngresos = sales.reduce((a, s) => a + (s.total || 0), 0)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
        <div>Cargando datos del dashboard...</div>
      </div>
    )
  }

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <>
      <style>{`
.adm-root { display:flex; min-height:100vh; background:#0a0a0a; font-family:'DM Sans',sans-serif; color:#fff; }
/* SIDEBAR */
.adm-sidebar { width:220px; background:#0e0e0e; border-right:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; flex-shrink:0; }
.adm-logo { padding:20px 16px 16px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:10px; }
.adm-logo-sq { width:32px; height:32px; background:#FF4500; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:14px; flex-shrink:0; }
.adm-logo-text { font-family:'Bebas Neue',sans-serif; font-size:1.2rem; letter-spacing:2px; color:#fff; line-height:1; }
.adm-logo-sub { font-size:0.65rem; color:rgba(255,69,0,0.7); letter-spacing:1px; text-transform:uppercase; }
.adm-nav { flex:1; padding:12px 8px; }
.adm-nav-group { margin-bottom:20px; }
.adm-nav-group-label { font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.2); padding:0 8px; margin-bottom:6px; font-weight:600; }
.adm-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:10px; cursor:pointer; font-size:0.82rem; color:rgba(255,255,255,0.5); margin-bottom:2px; border:none; background:none; width:100%; text-align:left; transition:all 0.15s; }
.adm-nav-item:hover { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.8); }
.adm-nav-item.active { background:rgba(255,69,0,0.1); color:#FF4500; }
.adm-nav-item.active svg { opacity:1; }
.adm-nav-item svg { flex-shrink:0; opacity:0.5; }
.adm-nav-item.active .nav-dot { display:block; }
.nav-dot { display:none; width:5px; height:5px; border-radius:50%; background:#FF4500; margin-left:auto; }
.adm-sidebar-footer { padding:12px; border-top:1px solid rgba(255,255,255,0.06); }
.adm-admin-pill { display:flex; align-items:center; gap:10px; padding:10px; background:rgba(255,69,0,0.08); border:1px solid rgba(255,69,0,0.2); border-radius:12px; }
.adm-admin-av { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#FF4500,#ff6a35); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
.adm-admin-name { font-size:0.78rem; font-weight:600; color:#fff; }
.adm-admin-role { font-size:0.65rem; color:#FF4500; }
.adm-logout-btn { margin-top:8px; width:100%; background:none; border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.35); padding:7px; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.75rem; cursor:pointer; transition:all 0.2s; }
.adm-logout-btn:hover { border-color:rgba(255,69,0,0.3); color:#FF4500; background:rgba(255,69,0,0.06); }
/* MAIN */
.adm-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:auto; }
.adm-topbar { padding:14px 24px; border-bottom:1px solid rgba(255,255,255,0.06); background:#0e0e0e; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; position:sticky; top:0; z-index:10; }
.adm-topbar-left h1 { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:2px; color:#fff; }
.adm-topbar-left p { font-size:0.75rem; color:rgba(255,255,255,0.3); margin-top:1px; }
.adm-topbar-right { display:flex; gap:10px; align-items:center; }
/* CONTENT */
.adm-content { padding:24px; flex:1; }
/* METRICS */
.adm-metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
.adm-metric { background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:18px; position:relative; overflow:hidden; }
.adm-metric::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#FF4500,transparent); }
.adm-metric-label { font-size:0.72rem; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
.adm-metric-val { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:1px; color:#fff; line-height:1; margin-bottom:4px; }
.adm-metric-sub { font-size:0.72rem; color:rgba(255,255,255,0.25); }
.metric-up { color:#4ade80; }
.metric-down { color:#f87171; }
/* CHARTS */
.adm-charts-row { display:grid; grid-template-columns:2fr 1fr; gap:14px; margin-bottom:24px; }
.adm-chart-card { background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px; }
.adm-chart-title { font-size:0.88rem; font-weight:600; color:#fff; margin-bottom:3px; }
.adm-chart-sub { font-size:0.72rem; color:rgba(255,255,255,0.3); margin-bottom:14px; }
.adm-legend { display:flex; gap:14px; margin-bottom:12px; flex-wrap:wrap; }
.adm-legend-item { display:flex; align-items:center; gap:5px; font-size:0.72rem; color:rgba(255,255,255,0.4); }
.adm-legend-dot { width:10px; height:10px; border-radius:2px; }
/* TABLE */
.adm-table-card { background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
.adm-table-head { padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:space-between; }
.adm-table-head-title { font-size:0.88rem; font-weight:600; color:#fff; }
table.adm-table { width:100%; border-collapse:collapse; font-size:0.82rem; }
.adm-table th { padding:10px 16px; text-align:left; font-size:0.65rem; font-weight:600; color:rgba(255,255,255,0.25); border-bottom:1px solid rgba(255,255,255,0.06); text-transform:uppercase; letter-spacing:1px; }
.adm-table td { padding:11px 16px; color:rgba(255,255,255,0.65); border-bottom:1px solid rgba(255,255,255,0.04); }
.adm-table tr:last-child td { border-bottom:none; }
.adm-table tr:hover td { background:rgba(255,255,255,0.02); }
/* BADGES */
.adm-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:50px; font-size:0.68rem; font-weight:600; }
.badge-success { background:rgba(74,222,128,0.1); color:#4ade80; }
.badge-warning { background:rgba(251,191,36,0.1); color:#fbbf24; }
.badge-info { background:rgba(96,165,250,0.1); color:#60a5fa; }
.badge-danger { background:rgba(248,113,113,0.1); color:#f87171; }
.badge-gray { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.4); }
/* BUTTONS */
.adm-btn { padding:7px 14px; border-radius:9px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:0.78rem; cursor:pointer; transition:all 0.15s; }
.adm-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }
.adm-btn-primary { background:#FF4500; color:#fff; border-color:#FF4500; }
.adm-btn-primary:hover { background:#e03d00; border-color:#e03d00; }
.adm-btn-danger { background:rgba(248,113,113,0.1); color:#f87171; border-color:rgba(248,113,113,0.2); }
.adm-btn-danger:hover { background:rgba(248,113,113,0.2); }
.adm-btn-sm { padding:4px 10px; font-size:0.72rem; border-radius:7px; }
/* PERIOD SELECT */
.adm-period-select { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.78rem; padding:7px 12px; cursor:pointer; }
.adm-period-select:focus { outline:none; border-color:rgba(255,69,0,0.4); }
.adm-period-select option { background:#111; color:#fff; }
/* SEARCH ROW */
.adm-search-row { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; align-items:center; }
.adm-search-row input, .adm-search-row select { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.82rem; padding:8px 12px; }
.adm-search-row input { flex:1; min-width:200px; }
.adm-search-row input::placeholder { color:rgba(255,255,255,0.2); }
.adm-search-row input:focus, .adm-search-row select:focus { outline:none; border-color:rgba(255,69,0,0.4); }
.adm-search-row select option { background:#111; color:#fff; }
/* TABS */
.adm-tabs { display:flex; gap:0; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.06); }
.adm-tab { padding:9px 16px; font-size:0.78rem; color:rgba(255,255,255,0.35); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; background:none; border-top:none; border-left:none; border-right:none; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
.adm-tab:hover { color:rgba(255,255,255,0.6); }
.adm-tab.active { color:#FF4500; border-bottom-color:#FF4500; font-weight:600; }
`}</style>
      <style>{`
/* MODAL */
.adm-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1rem; }
.adm-modal { background:#111; border:1px solid rgba(255,255,255,0.1); border-radius:20px; width:100%; max-width:460px; max-height:90vh; overflow:auto; box-shadow:0 40px 80px rgba(0,0,0,0.6); }
.adm-modal-header { padding:18px 22px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; }
.adm-modal-title { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; letter-spacing:2px; color:#fff; }
.adm-modal-body { padding:22px; }
.adm-modal-footer { padding:14px 22px; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:10px; justify-content:flex-end; }
.adm-form-group { margin-bottom:16px; }
.adm-form-label { font-size:0.72rem; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:rgba(255,255,255,0.35); display:block; margin-bottom:6px; }
.adm-form-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.88rem; padding:9px 12px; transition:border-color 0.2s; }
.adm-form-input:focus { outline:none; border-color:rgba(255,69,0,0.4); background:rgba(255,69,0,0.03); }
.adm-form-input::placeholder { color:rgba(255,255,255,0.2); }
.adm-form-input option { background:#111; color:#fff; }
.adm-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.adm-detail-box { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:16px; }
.adm-detail-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:0.82rem; }
.adm-detail-row:last-child { border-bottom:none; }
.adm-detail-row .key { color:rgba(255,255,255,0.35); }
.adm-detail-row .val { color:#fff; font-weight:500; text-align:right; }
/* PAGINATION */
.adm-pagination { display:flex; align-items:center; justify-content:space-between; padding:13px 18px; border-top:1px solid rgba(255,255,255,0.06); font-size:0.75rem; color:rgba(255,255,255,0.25); }
.adm-page-btns { display:flex; gap:4px; }
.adm-page-btn { width:28px; height:28px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background:none; cursor:pointer; font-size:0.75rem; color:rgba(255,255,255,0.4); display:flex; align-items:center; justify-content:center; }
.adm-page-btn.active { background:#FF4500; color:#fff; border-color:#FF4500; }
/* REPORT */
.adm-report-filters { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
.adm-report-filter-card { background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:16px; }
.adm-report-filter-card label { font-size:0.72rem; color:rgba(255,255,255,0.35); display:block; margin-bottom:7px; text-transform:uppercase; letter-spacing:1px; }
.adm-export-btns { display:flex; gap:10px; margin-bottom:22px; flex-wrap:wrap; }
.adm-export-btn { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:0.82rem; cursor:pointer; transition:all 0.2s; }
.adm-export-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }
.adm-export-btn.pdf { border-color:rgba(248,113,113,0.3); color:#f87171; background:rgba(248,113,113,0.06); }
.adm-export-btn.xlsx { border-color:rgba(74,222,128,0.3); color:#4ade80; background:rgba(74,222,128,0.06); }
@media (max-width:900px) {
.adm-sidebar { width:56px; }
.adm-logo-text, .adm-logo-sub, .adm-nav-group-label, .adm-nav-label, .adm-admin-name, .adm-admin-role, .adm-logout-btn { display:none; }
.adm-logo-sq { margin:0 auto; }
.adm-admin-pill { justify-content:center; }
.adm-metrics { grid-template-columns:repeat(2,1fr); }
.adm-charts-row { grid-template-columns:1fr; }
.adm-report-filters { grid-template-columns:1fr; }
}
      `}</style>

      <div className="adm-root">
        {/* SIDEBAR */}
        <aside className="adm-sidebar">
          <div className="adm-logo">
            <div className="adm-logo-sq">S</div>
            <div>
              <div className="adm-logo-text">SPORTA</div>
              <div className="adm-logo-sub">Admin Panel</div>
            </div>
          </div>
          <nav className="adm-nav">
            <div className="adm-nav-group">
              <div className="adm-nav-group-label">Principal</div>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg> },
                { id: 'users', label: 'Usuarios', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                { id: 'products', label: 'Productos', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                { id: 'sales', label: 'Ventas', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                { id: 'reports', label: 'Reportes', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8"/></svg> },
              ].map(({ id, label, icon }) => (
                <button key={id} className={`adm-nav-item ${activePage === id ? 'active' : ''}`} onClick={() => setActivePage(id)}>
                  {icon}
                  <span className="adm-nav-label">{label}</span>
                  <span className="nav-dot" />
                </button>
              ))}
            </div>
          </nav>
          <div className="adm-sidebar-footer">
            <div className="adm-admin-pill">
              <div className="adm-admin-av">AS</div>
              <div>
                <div className="adm-admin-name">{user?.name || 'Admin Sporta'}</div>
                <div className="adm-admin-role">Administrador</div>
              </div>
            </div>
            <button className="adm-logout-btn" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="adm-main">
          <div className="adm-topbar">
            <div className="adm-topbar-left">
              <h1>{{ dashboard: 'Dashboard', users: 'Usuarios', products: 'Productos', sales: 'Ventas', reports: 'Reportes' }[activePage]}</h1>
              <p>Panel de administración Sporta</p>
            </div>
            <div className="adm-topbar-right">
              {activePage === 'dashboard' && (
                <select value={period} onChange={e => setPeriod(e.target.value)} className="adm-period-select">
                  <option value="daily">Diario</option>
                  <option value="monthly">Mensual</option>
                  <option value="annual">Anual</option>
                </select>
              )}
            </div>
          </div>

          <div className="adm-content">
            {/* ═══ DASHBOARD ═══════════════════════════════════════ */}
            {activePage === 'dashboard' && (
              <>
                <div className="adm-metrics">
                  {[
                    { label: 'Ingresos totales', val: `S/ ${(stats?.totalRevenue || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: <><span className="metric-up">↑ 12.4%</span> vs mes anterior</> },
                    { label: 'Pedidos', val: stats?.totalOrders || 0, sub: <><span className="metric-up">↑ 8.1%</span> este mes</> },
                    { label: 'Usuarios', val: stats?.totalUsers || 0, sub: <><span className="metric-up">↑ 34</span> esta semana</> },
                    { label: 'Productos activos', val: products.filter(p => p.status === 'Activo').length, sub: `${products.filter(p => p.status === 'Sin stock').length} sin stock` },
                  ].map(m => (
                    <div key={m.label} className="adm-metric">
                      <div className="adm-metric-label">{m.label}</div>
                      <div className="adm-metric-val">{m.val}</div>
                      <div className="adm-metric-sub">{m.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="adm-charts-row">
                  <div className="adm-chart-card">
                    <div className="adm-chart-title">Ventas por período</div>
                    <div className="adm-chart-sub">{{ daily: 'Esta semana', monthly: 'Mensual 2025', annual: 'Anual 2021–2025' }[period]}</div>
                    <div className="adm-legend">
                      <div className="adm-legend-item"><div className="adm-legend-dot" style={{ background: '#FF4500' }}></div>Ingresos</div>
                      <div className="adm-legend-item"><div className="adm-legend-dot" style={{ background: '#94a3b8' }}></div>Pedidos</div>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: 220 }}>
                      <canvas ref={salesChartRef} role="img" aria-label="Gráfico de ventas por período">Datos de ventas por período seleccionado.</canvas>
                    </div>
                  </div>

                  <div className="adm-chart-card">
                    <div className="adm-chart-title">Ventas por categoría</div>
                    <div className="adm-chart-sub">Distribución del catálogo</div>
                    <div className="adm-legend">
                      {[['Running', '#FF4500'], ['Lifestyle', '#3b82f6'], ['Basketball', '#22c55e']].map(([l, c]) => (
                        <div key={l} className="adm-legend-item">
                          <div className="adm-legend-dot" style={{ background: c, borderRadius: '50%' }}></div>{l}
                        </div>
                      ))}
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: 180 }}>
                      <canvas ref={catChartRef} role="img" aria-label="Gráfico de dona por categoría">Running, Lifestyle, Basketball.</canvas>
                    </div>
                  </div>
                </div>

                <div className="adm-table-card">
                  <div className="adm-table-head">
                    <div className="adm-table-head-title">Productos más vendidos</div>
                    <button className="adm-btn adm-btn-sm" onClick={() => setActivePage('products')}>Ver todos →</button>
                  </div>
                  <table className="adm-table">
                    <thead>
                      <tr><th>#</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 6).map((p, i) => (
                        <tr key={p.id}>
                          <td style={{ color: 'rgba(255,255,255,0.25)' }}>{i + 1}</td>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 18 }}>{p.emoji}</span>{p.name}</div></td>
                          <td><StatusBadge status={p.category === 'running' ? 'info' : p.category === 'basketball' ? 'warning' : 'gray'} /></td>
                          <td style={{ color: '#FF4500', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem' }}>S/ {p.price.toFixed(2)}</td>
                          <td>{p.stock}</td>
                          <td><StatusBadge status={p.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ═══ USUARIOS ════════════════════════════════════════ */}
            {activePage === 'users' && (
              <>
                <div className="adm-search-row">
                  <input type="text" placeholder="Buscar por nombre o email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
                    <option value="">Todos los estados</option>
                    <option value="Activo">Activo</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
                <div className="adm-table-card">
                  <div className="adm-table-head">
                    <div className="adm-table-head-title">{filteredUsers.length} clientes registrados</div>
                  </div>
                  <table className="adm-table">
                    <thead>
                      <tr><th>Usuario</th><th>Email</th><th>Registro</th><th>Pedidos</th><th>Gastado</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)' }}>Sin resultados</td></tr>
                      ) : filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={u.name} />{u.name}</div></td>
                          <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{u.email}</td>
                          <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{u.date}</td>
                          <td>{u.orders}</td>
                          <td style={{ color: '#FF4500' }}>S/ {u.spent}</td>
                          <td><StatusBadge status={u.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="adm-btn adm-btn-sm" onClick={() => { setSelectedUser(u); setShowUserModal(true) }}>Ver</button>
                              <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => deleteUser(u.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="adm-pagination">
                    <span>Mostrando {filteredUsers.length} de {users.length}</span>
                    <div className="adm-page-btns">
                      <button className="adm-page-btn active">1</button>
                      <button className="adm-page-btn">2</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══ PRODUCTOS ═══════════════════════════════════════ */}
            {activePage === 'products' && (
              <>
                <div className="adm-search-row">
                  <input type="text" placeholder="Buscar producto..." value={prodSearch} onChange={e => setProdSearch(e.target.value)} />
                  <select value={prodCat} onChange={e => setProdCat(e.target.value)} style={{ minWidth: 140 }}>
                    <option value="">Todas las categorías</option>
                    <option value="running">Running</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="basketball">Basketball</option>
                  </select>
                  <button className="adm-btn adm-btn-primary" onClick={() => openProductModal()}>+ Nuevo producto</button>
                </div>
                <div className="adm-table-card">
                  <div className="adm-table-head">
                    <div className="adm-table-head-title">{filteredProducts.length} productos</div>
                  </div>
                  <table className="adm-table">
                    <thead>
                      <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Badge</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{p.emoji}</div>
                              {p.name}
                            </div>
                          </td>
                          <td><span className="adm-badge badge-gray">{p.category}</span></td>
                          <td style={{ color: '#FF4500', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem' }}>S/ {p.price.toFixed(2)}</td>
                          <td>{p.stock}</td>
                          <td><span className="adm-badge badge-gray">{p.badge}</span></td>
                          <td><StatusBadge status={p.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="adm-btn adm-btn-sm" onClick={() => openProductModal(p)}>Editar</button>
                              <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => deleteProduct(p.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ═══ VENTAS ══════════════════════════════════════════ */}
            {activePage === 'sales' && (
              <>
                <div className="adm-tabs">
                  {[['all', 'Todos'], ['pending', 'Pendientes'], ['paid', 'Pagados'], ['shipped', 'Enviados']].map(([id, label]) => (
                    <button key={id} className={`adm-tab ${salesTab === id ? 'active' : ''}`} onClick={() => setSalesTab(id)}>{label}</button>
                  ))}
                </div>
                <div className="adm-search-row">
                  <input type="text" placeholder="Buscar pedido o cliente..." value={salesSearch} onChange={e => setSalesSearch(e.target.value)} />
                  <select value={salesStatusFilter} onChange={e => setSalesStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                  </select>
                </div>
                <div className="adm-table-card">
                  <div className="adm-table-head">
                    <div className="adm-table-head-title">{filteredSales.length} pedidos</div>
                  </div>
                  <table className="adm-table">
                    <thead>
                      <tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Pago</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {filteredSales.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)' }}>Sin resultados</td></tr>
                      ) : filteredSales.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{s.id}</td>
                          <td>{s.client}</td>
                          <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{s.date}</td>
                          <td style={{ color: '#FF4500', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem' }}>S/ {s.total.toFixed(2)}</td>
                          <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{s.payment}</td>
                          <td><StatusBadge status={s.status} /></td>
                          <td><button className="adm-btn adm-btn-sm" onClick={() => { setSelectedOrder(s); setShowOrderModal(true) }}>Ver detalle</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="adm-pagination">
                    <span>Mostrando {filteredSales.length} pedidos · Total S/ {filteredSales.reduce((a, s) => a + s.total, 0).toFixed(2)}</span>
                    <div className="adm-page-btns">
                      <button className="adm-page-btn active">1</button>
                      <button className="adm-page-btn">2</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══ REPORTES ════════════════════════════════════════ */}
            {activePage === 'reports' && (
              <>
                <div className="adm-report-filters">
                  <div className="adm-report-filter-card">
                    <label>Fecha inicio</label>
                    <input type="date" value={reportFrom} onChange={e => setReportFrom(e.target.value)} className="adm-form-input" />
                  </div>
                  <div className="adm-report-filter-card">
                    <label>Fecha fin</label>
                    <input type="date" value={reportTo} onChange={e => setReportTo(e.target.value)} className="adm-form-input" />
                  </div>
                  <div className="adm-report-filter-card">
                    <label>Tipo de reporte</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="adm-form-input">
                      <option value="sales">Ventas</option>
                      <option value="users">Usuarios</option>
                      <option value="products">Productos</option>
                    </select>
                  </div>
                </div>

                <div className="adm-export-btns">
                  <button className="adm-export-btn pdf" onClick={() => generateReport('pdf')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8"/></svg>
                    Exportar PDF
                  </button>
                  <button className="adm-export-btn xlsx" onClick={() => generateReport('excel')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.8"/><line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" strokeWidth="1.8"/></svg>
                    Exportar Excel
                  </button>
                </div>

                <div className="adm-table-card" style={{ marginBottom: 20 }}>
                  <div className="adm-table-head">
                    <div className="adm-table-head-title">Vista previa — {reportType === 'sales' ? 'Ventas' : reportType === 'users' ? 'Usuarios' : 'Productos'} ({reportFrom} al {reportTo})</div>
                  </div>
                  <table className="adm-table">
                    {reportType === 'sales' && (
                      <>
                        <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
                        <tbody>
                          {sales.slice(0, 8).map(s => <tr key={s.id}><td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{s.id}</td><td>{s.client}</td><td style={{ color: 'rgba(255,255,255,0.3)' }}>{s.date}</td><td>S/ {s.total.toFixed(2)}</td><td><StatusBadge status={s.status} /></td></tr>)}
                        </tbody>
                      </>
                    )}
                    {reportType === 'users' && (
                      <>
                        <thead><tr><th>Nombre</th><th>Email</th><th>Pedidos</th><th>Total</th><th>Estado</th></tr></thead>
                        <tbody>
                          {users.map(u => <tr key={u.id}><td>{u.name}</td><td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{u.email}</td><td>{u.orders}</td><td>S/ {u.spent}</td><td><StatusBadge status={u.status} /></td></tr>)}
                        </tbody>
                      </>
                    )}
                    {reportType === 'products' && (
                      <>
                        <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th></tr></thead>
                        <tbody>
                          {products.map(p => <tr key={p.id}><td>{p.emoji} {p.name}</td><td>{p.category}</td><td>S/ {p.price.toFixed(2)}</td><td>{p.stock}</td><td><StatusBadge status={p.status} /></td></tr>)}
                        </tbody>
                      </>
                    )}
                  </table>
                </div>

                <div className="adm-chart-card">
                  <div className="adm-chart-title">Tendencia de ventas</div>
                  <div className="adm-chart-sub">Ingresos mensuales 2025</div>
                  <div style={{ position: 'relative', width: '100%', height: 180 }}>
                    <canvas ref={reportChartRef} role="img" aria-label="Gráfico de línea de tendencia">Tendencia de ingresos por mes.</canvas>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ═══ MODAL PRODUCTO ══════════════════════════════════════ */}
      {showProductModal && (
        <div className="adm-modal-overlay" onClick={e => e.target.className === 'adm-modal-overlay' && setShowProductModal(false)}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <div className="adm-modal-title">{editingProduct ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}</div>
              <button className="adm-btn adm-btn-sm" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-form-label">Nombre *</label>
                  <input className="adm-form-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Air Sprint Pro" />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Precio (S/) *</label>
                  <input className="adm-form-input" type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-form-label">Categoría</label>
                  <select className="adm-form-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                    <option value="running">Running</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="basketball">Basketball</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Stock</label>
                  <input className="adm-form-input" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="100" />
                </div>
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Badge (opcional)</label>
                <input className="adm-form-input" value={productForm.badge} onChange={e => setProductForm({ ...productForm, badge: e.target.value })} placeholder="Nuevo / Popular / Boost" />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Imagen del producto</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="adm-form-input"
                  style={{ padding: '8px' }}
                />
                {productForm.image && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img 
                      src={productForm.image} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }} 
                    />
                  </div>
                )}
                {uploadingImage && (
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#FF4500' }}>
                    Subiendo imagen...
                  </div>
                )}
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Descripción</label>
                <textarea className="adm-form-input" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Descripción del producto..." style={{ resize: 'vertical' }} />
              </div>
              <div className="adm-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                  <input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })} style={{ width: 16, height: 16 }} />
                  Producto destacado
                </label>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setShowProductModal(false)}>Cancelar</button>
              <button className="adm-btn adm-btn-primary" onClick={saveProduct}>Guardar producto</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL PEDIDO ════════════════════════════════════════ */}
      {showOrderModal && selectedOrder && (
        <div className="adm-modal-overlay" onClick={e => e.target.className === 'adm-modal-overlay' && setShowOrderModal(false)}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <div className="adm-modal-title">PEDIDO {selectedOrder.id}</div>
              <button className="adm-btn adm-btn-sm" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-box">
                {[
                  ['Cliente', selectedOrder.client],
                  ['Fecha', selectedOrder.date],
                  ['Productos', selectedOrder.items],
                  ['Método de pago', selectedOrder.payment],
                  ['Total', `S/ ${selectedOrder.total.toFixed(2)}`]
                ].map(([k, v]) => (
                  <div key={k} className="adm-detail-row">
                    <span className="key">{k}</span>
                    <span className="val">{v}</span>
                  </div>
                ))}
                <div className="adm-detail-row">
                  <span className="key">Estado</span>
                  <span className="val"><StatusBadge status={selectedOrder.status} /></span>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setShowOrderModal(false)}>Cerrar</button>
              {selectedOrder.status !== 'shipped' && selectedOrder.status !== 'Enviado' && (
                <button className="adm-btn adm-btn-primary" onClick={() => advanceOrderStatus(selectedOrder.id)}>
                  {selectedOrder.status === 'pending' || selectedOrder.status === 'Pendiente' ? 'Marcar como Pagado' : 'Marcar como Enviado'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL USUARIO ═══════════════════════════════════════ */}
      {showUserModal && selectedUser && (
        <div className="adm-modal-overlay" onClick={e => e.target.className === 'adm-modal-overlay' && setShowUserModal(false)}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <div className="adm-modal-title">DETALLE DEL USUARIO</div>
              <button className="adm-btn adm-btn-sm" onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <Avatar name={selectedUser.name} size={48} />
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', letterSpacing: 1 }}>{selectedUser.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{selectedUser.email}</div>
                </div>
              </div>
              <div className="adm-detail-box">
                {[
                  ['Registro', selectedUser.date],
                  ['Total pedidos', selectedUser.orders],
                  ['Total gastado', `S/ ${selectedUser.spent}`],
                  ['Estado', '']
                ].map(([k, v]) => (
                  <div key={k} className="adm-detail-row">
                    <span className="key">{k}</span>
                    <span className="val">{k === 'Estado' ? <StatusBadge status={selectedUser.status} /> : v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-danger" onClick={() => toggleUserStatus(selectedUser.id)}>
                {selectedUser.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
              </button>
              <button className="adm-btn" onClick={() => setShowUserModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
