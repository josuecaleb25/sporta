import { createClient } from '@supabase/supabase-js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Configurar cliente de Supabase (opcional)
let supabase = null
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
    supabase = createClient(supabaseUrl, supabaseKey)
  }
} catch (error) {
  console.warn('Supabase client not configured:', error)
}

const getToken = () => localStorage.getItem('sporta_token')

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
})

export const api = {
  supabase, // Exportar cliente de Supabase
  
  // AUTH
  register: (data) =>
    fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  googleAuth: (data) =>
    fetch(`${BASE}/auth/google`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  me: (token) =>
    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  // PRODUCTS
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'default'))
    ).toString()
    return fetch(`${BASE}/products${qs ? '?' + qs : ''}`, { headers: headers() }).then(r => r.json())
  },

  // CART
  getCart: () =>
    fetch(`${BASE}/cart`, { headers: headers() }).then(r => r.json()),

  addToCart: (product_id, quantity = 1, selected_size = null, selected_color = null) =>
    fetch(`${BASE}/cart`, { 
      method: 'POST', 
      headers: headers(), 
      body: JSON.stringify({ product_id, quantity, selected_size, selected_color }) 
    }).then(r => r.json()),

  updateCartItem: (cart_item_id, quantity) =>
    fetch(`${BASE}/cart/${cart_item_id}`, { 
      method: 'PATCH', 
      headers: headers(), 
      body: JSON.stringify({ quantity }) 
    }).then(r => r.json()),

  removeFromCart: (cart_item_id) =>
    fetch(`${BASE}/cart/${cart_item_id}`, { 
      method: 'DELETE', 
      headers: headers() 
    }).then(r => r.json()),

  clearCart: () =>
    fetch(`${BASE}/cart`, { 
      method: 'DELETE', 
      headers: headers() 
    }).then(r => r.json()),

  // ORDERS
  createOrder: (data) =>
    fetch(`${BASE}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // CONTACT
  sendContact: (data) =>
    fetch(`${BASE}/contact`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // ADMIN
  admin: {
    getStats: () =>
      fetch(`${BASE}/admin/stats`, { headers: headers() }).then(r => r.json()),

    getUsers: () =>
      fetch(`${BASE}/admin/users`, { headers: headers() }).then(r => r.json()),
    updateUser: (id, data) =>
      fetch(`${BASE}/admin/users/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
    deleteUser: (id) =>
      fetch(`${BASE}/admin/users/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),

    createProduct: (data) =>
      fetch(`${BASE}/admin/products`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
    updateProduct: (id, data) =>
      fetch(`${BASE}/admin/products/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
    deleteProduct: (id) =>
      fetch(`${BASE}/admin/products/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),

    getOrders: () =>
      fetch(`${BASE}/admin/orders`, { headers: headers() }).then(r => r.json()),
    updateOrderStatus: (id, status) =>
      fetch(`${BASE}/admin/orders/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) }).then(r => r.json()),
  },
}
