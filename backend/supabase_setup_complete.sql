-- ============================================
-- SPORTA E-COMMERCE - CONFIGURACIÓN COMPLETA DE SUPABASE
-- ============================================
-- Ejecuta este script completo en tu Supabase SQL Editor
-- Versión: 1.0 - Configuración final limpia
-- ============================================

-- ============================================
-- 1. TABLA: users (Usuarios)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  blocked BOOLEAN DEFAULT false,
  google_id TEXT UNIQUE,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. TABLA: categories (Categorías de productos)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Insertar categorías iniciales
INSERT INTO categories (name, slug, description) VALUES
  ('Running', 'running', 'Zapatillas para correr y running'),
  ('Lifestyle', 'lifestyle', 'Zapatillas urbanas y casuales'),
  ('Basketball', 'basketball', 'Zapatillas de baloncesto')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. TABLA: products (Productos)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  badge TEXT,
  description TEXT,
  image TEXT,
  sizes TEXT[] DEFAULT ARRAY['38', '39', '40', '41', '42', '43', '44'],
  colors TEXT[] DEFAULT ARRAY['Negro', 'Blanco', 'Gris'],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- ============================================
-- 4. TABLA: cart_items (Items del carrito)
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================
-- 5. TABLA: orders (Pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  reference TEXT,
  delivery_notes TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit', 'yape', 'transfer', 'cash')),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 6. TABLA: order_items (Items de pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image TEXT,
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- 7. TABLA: contacts (Mensajes de contacto)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- ============================================
-- 8. TABLA: addresses (Direcciones guardadas - opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  reference TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ============================================
-- 9. FUNCIONES: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Políticas: users
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can be created by anyone" ON users;
CREATE POLICY "Users can be created by anyone" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true) WITH CHECK (true);

-- Políticas: categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Políticas: products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Products can be managed" ON products;
CREATE POLICY "Products can be managed" ON products FOR ALL USING (true) WITH CHECK (true);

-- Políticas: cart_items
DROP POLICY IF EXISTS "Cart items are accessible by everyone" ON cart_items;
CREATE POLICY "Cart items are accessible by everyone" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- Políticas: orders
DROP POLICY IF EXISTS "Orders are accessible by everyone" ON orders;
CREATE POLICY "Orders are accessible by everyone" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Políticas: order_items
DROP POLICY IF EXISTS "Order items are accessible by everyone" ON order_items;
CREATE POLICY "Order items are accessible by everyone" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- Políticas: contacts
DROP POLICY IF EXISTS "Contacts are accessible by everyone" ON contacts;
CREATE POLICY "Contacts are accessible by everyone" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- Políticas: addresses
DROP POLICY IF EXISTS "Addresses are accessible by everyone" ON addresses;
CREATE POLICY "Addresses are accessible by everyone" ON addresses FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 11. DATOS INICIALES: Usuario Administrador
-- ============================================
-- Contraseña: admin123
-- Hash generado con bcrypt (10 rounds)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin Sporta', 'adminSporta@depor.pe', '$2a$10$SvV1It7MRSbY.0oMdcIES.lRoGX0Zu0Vei30D2S9WFUAWMuSTquvK', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role;

-- ============================================
-- 12. DATOS INICIALES: Productos de ejemplo
-- ============================================
INSERT INTO products (name, category, category_id, slug, price, stock, badge, description, image, status, is_featured) VALUES
  (
    'Air Sprint Pro',
    'running',
    (SELECT id FROM categories WHERE slug = 'running'),
    'air-sprint-pro',
    449.99,
    50,
    'Nuevo',
    'Zapatillas de running de alto rendimiento con tecnología de amortiguación avanzada para corredores exigentes',
    '/src/assets/shoe1.jpg',
    'active',
    true
  ),
  (
    'Urban Pulse NMD',
    'lifestyle',
    (SELECT id FROM categories WHERE slug = 'lifestyle'),
    'urban-pulse-nmd',
    399.99,
    45,
    'Popular',
    'Estilo urbano moderno con comodidad excepcional para el día a día. Diseño versátil y contemporáneo',
    '/src/assets/shoe2.jpg',
    'active',
    true
  ),
  (
    'Classic Strike',
    'lifestyle',
    (SELECT id FROM categories WHERE slug = 'lifestyle'),
    'classic-strike',
    349.99,
    40,
    'Clásico',
    'Diseño atemporal que nunca pasa de moda, perfecto para cualquier ocasión casual o deportiva',
    '/src/assets/shoe3.jpg',
    'active',
    true
  ),
  (
    'Court Force Low',
    'basketball',
    (SELECT id FROM categories WHERE slug = 'basketball'),
    'court-force-low',
    379.99,
    35,
    'Retro',
    'Inspiradas en el baloncesto clásico con un toque retro moderno. Soporte y estilo en la cancha',
    '/src/assets/shoe4.jpg',
    'active',
    false
  ),
  (
    'ZX Boost Radical',
    'running',
    (SELECT id FROM categories WHERE slug = 'running'),
    'zx-boost-radical',
    419.99,
    30,
    'Boost',
    'Máxima energía de retorno con tecnología Boost para corredores exigentes. Rendimiento superior',
    '/src/assets/shoe5.jpg',
    'active',
    true
  ),
  (
    'Stan Legend',
    'lifestyle',
    (SELECT id FROM categories WHERE slug = 'lifestyle'),
    'stan-legend',
    329.99,
    55,
    'Icono',
    'Un ícono del estilo deportivo casual que trasciende generaciones. Elegancia y comodidad',
    '/src/assets/shoe6.jpg',
    'active',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 13. VERIFICACIÓN: Mostrar resumen de tablas
-- ============================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'categories', 'products', 'cart_items', 'orders', 'order_items', 'contacts', 'addresses')
ORDER BY table_name;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- ✅ Configuración completa de Sporta E-commerce
-- 
-- Tablas creadas:
-- - users: Usuarios y administradores
-- - categories: Categorías de productos
-- - products: Catálogo de productos
-- - cart_items: Carrito de compras
-- - orders: Pedidos
-- - order_items: Items de pedidos
-- - contacts: Mensajes de contacto
-- - addresses: Direcciones guardadas (opcional)
--
-- Usuario admin creado:
-- Email: adminSporta@depor.pe
-- Password: admin123
--
-- 6 productos de ejemplo insertados
-- ============================================
