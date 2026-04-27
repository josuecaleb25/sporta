# 🏃‍♂️ SPORTA E-Commerce Platform

Plataforma de e-commerce moderna para venta de zapatillas deportivas, desarrollada con React, Node.js y Supabase.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Funcionalidades](#-funcionalidades)
- [Credenciales](#-credenciales)
- [Scripts Disponibles](#-scripts-disponibles)

---

## ✨ Características

### Para Clientes
- 🛍️ Catálogo de productos con filtros por categoría
- 🔍 Búsqueda y visualización detallada de productos
- 🛒 Carrito de compras persistente en base de datos
- 👤 Autenticación con email/password y Google OAuth
- 📦 Sistema de checkout con múltiples métodos de pago
- 📍 Gestión de direcciones de envío
- 📧 Formulario de contacto integrado
- 🎨 Diseño moderno y responsivo

### Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- 👥 Gestión de usuarios (bloquear/desbloquear)
- 📦 Gestión completa de productos (CRUD)
- 🛍️ Gestión de pedidos y estados
- 📈 Gráficos de ventas (Chart.js)
- 📊 Reportes exportables (CSV)
- 🔐 Panel de administración protegido

---

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Lucide React** - Iconos
- **Chart.js** - Gráficos y estadísticas
- **Google OAuth** - Autenticación social
- **Formspree** - Respaldo de formularios

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Supabase** - Base de datos PostgreSQL
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas
- **CORS** - Manejo de peticiones cross-origin

### Base de Datos
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)**
- **Triggers automáticos**
- **Índices optimizados**

---

## 📦 Requisitos Previos

- **Node.js** 16+ y npm
- **Cuenta de Supabase** (gratuita)
- **Cuenta de Google Cloud** (para OAuth)
- **Cuenta de Formspree** (opcional, para respaldo de formularios)

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Sporta-Ecommerce-Platform-
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuración

### 1. Configurar Supabase

#### a) Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL y la API Key (anon/public)

#### b) Ejecutar script SQL
1. Ve a SQL Editor en Supabase
2. Copia y pega el contenido de `backend/supabase_setup_complete.sql`
3. Ejecuta el script completo
4. Verifica que se crearon 8 tablas

### 2. Configurar variables de entorno

#### Backend (`backend/.env`)
```env
PORT=3001
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key
JWT_SECRET=tu-secreto-jwt-super-seguro-cambiar-en-produccion
```

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-supabase-anon-key
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

### 3. Configurar Google OAuth (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega orígenes autorizados:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio de producción
6. Copia el Client ID al archivo `.env` del frontend

### 4. Configurar Formspree (Opcional)

1. Ve a [formspree.io](https://formspree.io)
2. Crea formularios para:
   - Contacto: Actualiza el ID en `frontend/src/pages/Contact.jsx`
   - Pedidos: Actualiza el ID en `backend/src/routes/orders.js`

---

## 📁 Estructura del Proyecto

```
Sporta-Ecommerce-Platform-/
├── .git/                        # Control de versiones
├── .vscode/                     # Configuración del editor
├── .gitignore                   # Archivos ignorados por Git
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # Middleware de autenticación JWT
│   │   ├── routes/
│   │   │   ├── admin.js         # Endpoints de administración
│   │   │   ├── auth.js          # Autenticación y registro
│   │   │   ├── cart.js          # Carrito de compras
│   │   │   ├── contact.js       # Formulario de contacto
│   │   │   ├── googleAuth.js    # Autenticación con Google
│   │   │   ├── orders.js        # Gestión de pedidos
│   │   │   └── products.js      # Catálogo de productos
│   │   ├── db.js                # Conexión a Supabase
│   │   └── index.js             # Servidor Express
│   ├── .env                     # Variables de entorno
│   ├── .env.example             # Ejemplo de variables
│   ├── .gitignore               # Archivos ignorados
│   ├── package.json             # Dependencias del backend
│   ├── start.bat                # Script de inicio (Windows)
│   ├── restart.bat              # Script de reinicio (Windows)
│   └── supabase_setup_complete.sql  # Setup completo de BD
│
├── frontend/
│   ├── public/
│   │   ├── sporta.svg           # Logo
│   │   └── SportaVideoPublicitario.mp4
│   ├── src/
│   │   ├── assets/              # Imágenes de productos
│   │   │   ├── modelo1-5.png    # Imágenes de modelos
│   │   │   ├── shoe1-6.jpg      # Imágenes de zapatillas
│   │   │   └── Sporta_BLACK-logo.png
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx   # Panel de administración
│   │   │   ├── Auth.jsx             # Modal de login/registro
│   │   │   ├── Cart.jsx             # Carrito lateral
│   │   │   ├── Footer.jsx           # Pie de página
│   │   │   ├── Hero.jsx             # Banner principal
│   │   │   ├── Navbar.jsx           # Barra de navegación
│   │   │   ├── ProductCard.jsx      # Tarjeta de producto
│   │   │   └── Stats.jsx            # Estadísticas
│   │   ├── pages/
│   │   │   ├── About.jsx            # Página Nosotros
│   │   │   ├── Checkout.jsx         # Proceso de pago
│   │   │   ├── Contact.jsx          # Formulario de contacto
│   │   │   ├── Home.jsx             # Página principal
│   │   │   ├── ProductDetail.jsx    # Detalle de producto
│   │   │   └── Products.jsx         # Catálogo
│   │   ├── api.js               # Cliente API
│   │   ├── App.jsx              # Componente principal
│   │   ├── App.css              # Estilos globales
│   │   ├── index.css            # Estilos base
│   │   └── main.jsx             # Punto de entrada
│   ├── .env                     # Variables de entorno
│   ├── .env.example             # Ejemplo de variables
│   ├── eslint.config.js         # Configuración de ESLint
│   ├── index.html               # HTML principal
│   ├── package.json             # Dependencias del frontend
│   ├── vite.config.js           # Configuración de Vite
│   ├── GOOGLE_OAUTH_SETUP.md    # Guía de configuración OAuth
│   └── README.md                # Documentación del frontend
│
└── README.md                    # Este archivo (documentación principal)
```

---

## 🗄️ Base de Datos

### Tablas Principales

#### `users`
Usuarios del sistema (clientes y administradores)
- `id`, `name`, `email`, `password`, `role`, `blocked`
- `google_id`, `picture` (para OAuth)
- `created_at`

#### `categories`
Categorías de productos
- `id`, `name`, `slug`, `description`
- Valores: Running, Lifestyle, Basketball

#### `products`
Catálogo de productos
- `id`, `name`, `category`, `category_id`, `slug`
- `price`, `stock`, `badge`, `description`, `image`
- `sizes[]`, `colors[]`, `features[]`
- `is_featured`, `status`

#### `cart_items`
Items del carrito de compras
- `id`, `user_id`, `product_id`, `quantity`
- `selected_size`, `selected_color`

#### `orders`
Pedidos realizados
- `id`, `user_id`, `name`, `email`, `phone`
- `address`, `district`, `reference`, `delivery_notes`
- `payment_method`, `subtotal`, `shipping`, `total`
- `status` (pending, paid, shipped, cancelled)

#### `order_items`
Items de cada pedido
- `id`, `order_id`, `product_id`
- `name`, `price`, `quantity`, `image`
- `selected_size`, `selected_color`

#### `contacts`
Mensajes del formulario de contacto
- `id`, `name`, `email`, `subject`, `message`

#### `addresses`
Direcciones guardadas (opcional, no implementado aún)
- `id`, `user_id`, `name`, `address`, `district`
- `reference`, `phone`, `is_default`

---

## 🔌 API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /google` - Login con Google (usuarios existentes)
- `POST /google/register` - Registro con Google
- `GET /me` - Obtener usuario actual

### Productos (`/api/products`)
- `GET /` - Listar productos (con filtros)
- `GET /:id` - Obtener producto por ID

### Carrito (`/api/cart`)
- `GET /` - Obtener carrito del usuario
- `POST /` - Agregar producto al carrito
- `PATCH /:id` - Actualizar cantidad
- `DELETE /:id` - Eliminar item
- `DELETE /` - Vaciar carrito

### Pedidos (`/api/orders`)
- `POST /` - Crear nuevo pedido
- `GET /` - Listar pedidos del usuario
- `GET /:id` - Obtener pedido específico

### Contacto (`/api/contact`)
- `POST /` - Enviar mensaje de contacto

### Admin (`/api/admin`) 🔒
Requiere autenticación y rol de administrador

#### Estadísticas
- `GET /stats` - Estadísticas generales

#### Usuarios
- `GET /users` - Listar usuarios
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### Productos
- `POST /products` - Crear producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

#### Pedidos
- `GET /orders` - Listar todos los pedidos
- `PATCH /orders/:id` - Actualizar estado de pedido

---

## 🎯 Funcionalidades

### Sistema de Autenticación
- Registro con email y contraseña
- Login tradicional
- Google OAuth (Sign in with Google)
- Tokens JWT con expiración de 7 días
- Protección de rutas privadas

### Carrito de Compras
- Persistencia en base de datos
- Selección de talla y color
- Actualización de cantidades
- Cálculo automático de envío (gratis >S/150)
- Sincronización entre sesiones

### Sistema de Pedidos
- Múltiples métodos de pago:
  - Tarjeta de crédito/débito
  - Yape/Plin
  - Transferencia bancaria
  - Contra entrega
- Estados automáticos según método de pago
- Generación de comprobantes
- Notificaciones por email (Formspree)

### Panel de Administración
- Dashboard con métricas en tiempo real
- Gráficos de ventas (Chart.js):
  - Ventas por período (diario/mensual/anual)
  - Distribución por categorías (gráfico de dona)
- Gestión de usuarios:
  - Ver lista completa
  - Bloquear/desbloquear
  - Ver historial de compras
- Gestión de productos:
  - Crear, editar, eliminar
  - Subir imágenes (Supabase Storage)
  - Control de stock
- Gestión de pedidos:
  - Ver todos los pedidos
  - Cambiar estados
  - Filtrar por estado
- Reportes:
  - Exportar a CSV
  - Filtros por fecha
  - Gráficos de tendencias

---

## 🔑 Credenciales

### Usuario Administrador
```
Email: adminSporta@depor.pe
Password: admin123
```

### Productos de Ejemplo
El script SQL incluye 6 productos de ejemplo:
1. Air Sprint Pro (Running) - S/449.99
2. Urban Pulse NMD (Lifestyle) - S/399.99
3. Classic Strike (Lifestyle) - S/349.99
4. Court Force Low (Basketball) - S/379.99
5. ZX Boost Radical (Running) - S/419.99
6. Stan Legend (Lifestyle) - S/329.99

---

## 📜 Scripts Disponibles

### Backend
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start

# Windows
start.bat
restart.bat
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🚦 Flujo de Estados de Pedidos

```
pending → paid → shipped
   ↓
cancelled
```

### Estados Automáticos
- **Tarjeta/Yape**: `paid` (pago inmediato)
- **Transferencia/Efectivo**: `pending` (requiere verificación)

### Cambios Manuales (Admin)
- `pending` → `paid` (verificar pago)
- `paid` → `shipped` (enviar pedido)
- Cualquier estado → `cancelled` (cancelar)

---

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración
- Row Level Security (RLS) en Supabase
- Validación de datos en backend
- Protección contra inyección SQL
- CORS configurado
- Variables de entorno para secretos
- Protección contra doble envío de pedidos

---

## 🌐 Despliegue

### Backend
Recomendado: Railway, Render, o Heroku
1. Configurar variables de entorno
2. Instalar dependencias
3. Ejecutar `npm start`

### Frontend
Recomendado: Vercel, Netlify, o Cloudflare Pages
1. Build: `npm run build`
2. Directorio: `dist`
3. Configurar variables de entorno

### Base de Datos
Ya está en Supabase (cloud)

---

## 📝 Notas Importantes

1. **Carrito**: Se guarda en `cart_items` (base de datos), NO en localStorage
2. **Imágenes**: Actualmente usan rutas locales. Para producción, subir a Supabase Storage
3. **Formspree**: Opcional, el sistema funciona sin él
4. **Google OAuth**: Opcional, el sistema funciona con email/password
5. **Tabla addresses**: Existe pero no está implementada (funcionalidad futura)

---

## 🐛 Solución de Problemas

### Error: "Failed to resolve import @supabase/supabase-js"
```bash
cd frontend
npm install @supabase/supabase-js
```

### Error: "401 Unauthorized" en login
- Verificar que el usuario admin existe en la BD
- Ejecutar `backend/supabase_setup_complete.sql` completo

### Pedidos duplicados
- Protección implementada contra doble clic
- Si hay duplicados, usar script de limpieza en SQL Editor

### Carrito no persiste
- Verificar que la tabla `cart_items` existe
- Verificar que las columnas `selected_size` y `selected_color` existen

---

## 📧 Contacto

Para soporte o consultas sobre el proyecto:
- Email: adminSporta@depor.pe
- Teléfono: +51 925 841 052

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado con ❤️ para SPORTA**
