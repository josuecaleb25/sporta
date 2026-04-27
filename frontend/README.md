# 🏃‍♂️ SPORTA - E-commerce de Equipamiento Deportivo

<div align="center">
  <img src="./public/sporta.svg" alt="Sporta Logo" width="120"/>
  
  ### Plataforma moderna de venta de equipamiento deportivo premium
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Páginas](#-páginas)
- [Componentes](#-componentes)
- [Configuración](#-configuración)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Descripción

**SPORTA** es una aplicación web moderna de e-commerce especializada en equipamiento deportivo de alto rendimiento. Diseñada con React y Vite, ofrece una experiencia de usuario fluida y atractiva para atletas que buscan productos premium.

La plataforma incluye un sistema completo de autenticación, carrito de compras, checkout con múltiples métodos de pago, y generación automática de comprobantes.

---

## ✨ Características

### 🛒 E-commerce Completo
- **Catálogo de productos** con filtros por categoría, búsqueda y ordenamiento
- **Carrito de compras** interactivo con gestión de cantidades
- **Sistema de checkout** con múltiples métodos de pago
- **Generación automática de comprobantes** descargables

### 🔐 Autenticación
- Sistema de login y registro de usuarios
- Validación de formularios en tiempo real
- Protección de rutas (productos requieren autenticación)
- Integración con Google OAuth (UI preparada)

### 💳 Métodos de Pago
- Tarjeta de crédito/débito
- Yape / Plin (billeteras digitales)
- Transferencia bancaria
- Pago contra entrega

### 📧 Integración con Formspree
- Envío automático de pedidos por email
- Formulario de contacto funcional
- Notificaciones de compra

### 🎨 Diseño Moderno
- Interfaz dark mode con acentos en naranja (#FF4500)
- Animaciones y transiciones suaves
- Diseño responsive para todos los dispositivos
- Tipografía personalizada (Bebas Neue + DM Sans)

---

## � Tecnologías

### Frontend
- **React 19.1.1** - Biblioteca de UI
- **Vite 7.1.7** - Build tool y dev server
- **React Router DOM 7.9.3** - Navegación SPA

### Estilos
- **TailwindCSS 4.2.4** - Framework CSS utility-first
- **CSS-in-JS** - Estilos inline para componentes específicos
- **Framer Motion 12.23.22** - Animaciones

### Formularios
- **@formspree/react 3.0.0** - Manejo de formularios

### Iconos
- **Lucide React 0.545.0** - Biblioteca de iconos

### Herramientas de Desarrollo
- **ESLint 9.36.0** - Linter de código
- **@vitejs/plugin-react 5.0.4** - Plugin de React para Vite

---

## 📁 Estructura del Proyecto

```
sporta/
├── public/
│   └── sporta.svg                 # Logo de la aplicación
├── src/
│   ├── assets/                    # Recursos estáticos
│   │   ├── modelo1-5.png         # Imágenes de modelos
│   │   ├── shoe1-6.jpg           # Imágenes de productos
│   │   └── Sporta_BLACK-logo.png # Logo principal
│   ├── components/                # Componentes reutilizables
│   │   ├── Auth.jsx              # Modal de autenticación
│   │   ├── Cart.jsx              # Panel lateral del carrito
│   │   ├── Footer.jsx            # Pie de página
│   │   ├── Hero.jsx              # Sección hero con carrusel
│   │   ├── Navbar.jsx            # Barra de navegación
│   │   ├── ProductCard.jsx       # Tarjeta de producto
│   │   └── Stats.jsx             # Estadísticas de la empresa
│   ├── pages/                     # Páginas principales
│   │   ├── About.jsx             # Página sobre nosotros
│   │   ├── Checkout.jsx          # Proceso de pago
│   │   ├── Contact.jsx           # Formulario de contacto
│   │   ├── Home.jsx              # Página de inicio
│   │   ├── ProductDetail.jsx     # Detalle de producto
│   │   └── Products.jsx          # Catálogo de productos
│   ├── App.jsx                    # Componente principal
│   ├── App.css                    # Estilos globales
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos base
├── .gitignore
├── eslint.config.js               # Configuración de ESLint
├── index.html                     # HTML principal
├── package.json                   # Dependencias del proyecto
├── package-lock.json
├── README.md                      # Este archivo
└── vite.config.js                 # Configuración de Vite
```

---

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0 o yarn >= 1.22.0

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sporta.git
cd sporta
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno** (opcional)
```bash
# Crear archivo .env en la raíz
VITE_FORMSPREE_ENDPOINT=tu_endpoint_de_formspree
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

---

## 💻 Uso

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Genera build de producción
npm run preview      # Previsualiza el build

# Linting
npm run lint         # Ejecuta ESLint
```

### Flujo de Usuario

1. **Navegación**: Explora productos desde la página de inicio
2. **Autenticación**: Inicia sesión o regístrate para comprar
3. **Agregar al carrito**: Selecciona productos y agrégalos al carrito
4. **Checkout**: Completa el formulario de envío y selecciona método de pago
5. **Confirmación**: Recibe comprobante descargable y email de confirmación

---

## 🎯 Funcionalidades Principales

### 1. Sistema de Autenticación
```jsx
// Componente Auth.jsx
- Login con email y contraseña
- Registro de nuevos usuarios
- Validación de formularios
- Integración con Google (UI preparada)
```

### 2. Carrito de Compras
```jsx
// Componente Cart.jsx
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Indicador de envío gratis (+S/150)
- Persistencia en estado global
```

### 3. Proceso de Checkout
```jsx
// Página Checkout.jsx
- Formulario de datos de envío
- Selección de método de pago
- Validación de datos de tarjeta
- Generación de comprobante
- Integración con Formspree
```

### 4. Catálogo de Productos
```jsx
// Página Products.jsx
- Búsqueda en tiempo real
- Filtros por categoría
- Ordenamiento (precio, nombre)
- Vista de detalle de producto
- Protección por autenticación
```

---

## 📄 Páginas

### Home (`/`)
- Hero section con carrusel de productos destacados
- Estadísticas de la empresa
- Nuevos lanzamientos
- Beneficios de la tienda
- Call-to-action

### Products (`/products`)
- Catálogo completo de productos
- Barra de búsqueda
- Filtros por categoría (Running, Lifestyle, Basketball)
- Ordenamiento por precio y nombre
- Requiere autenticación para ver productos

### Product Detail (`/product/:id`)
- Imágenes del producto
- Descripción detallada
- Características técnicas
- Selector de talla y color
- Selector de cantidad
- Botón de agregar al carrito

### About (`/about`)
- Historia de la empresa
- Misión y valores
- Línea de tiempo
- Estadísticas corporativas

### Contact (`/contact`)
- Formulario de contacto integrado con Formspree
- Información de contacto
- Horarios de atención
- Enlaces a redes sociales

### Checkout (`/checkout`)
- Formulario de datos personales y envío
- Resumen del pedido
- Selección de método de pago
- Confirmación y generación de comprobante

---

## � Componentes

### Navbar
- Logo y navegación principal
- Indicador de carrito con contador
- Botón de login/registro
- Menú de usuario autenticado

### Hero
- Carrusel automático de productos
- Animaciones de entrada
- Call-to-action principal
- Tags de beneficios

### ProductCard
- Imagen del producto
- Nombre y categoría
- Precio
- Badge de estado (Nuevo, Popular, etc.)
- Botón de agregar al carrito

### Cart (Panel lateral)
- Lista de productos en el carrito
- Controles de cantidad
- Cálculo de subtotal y envío
- Botón de checkout
- Indicador de envío gratis

### Auth (Modal)
- Tabs de Login/Registro
- Validación de formularios
- Mensajes de error
- Botón de Google OAuth

### Footer
- Enlaces de navegación
- Información de contacto
- Copyright

### Stats
- Tarjetas de estadísticas
- Animaciones hover
- Iconos decorativos

---

## ⚙️ Configuración

### Vite Config (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### ESLint Config (`eslint.config.js`)
```javascript
// Configuración de ESLint para React
// Incluye reglas para hooks y refresh
```

### Formspree Integration
El proyecto usa Formspree para el manejo de formularios:
- **Contact Form**: Endpoint configurado en `Contact.jsx`
- **Checkout Form**: Endpoint configurado en `Checkout.jsx`

Para configurar tu propio endpoint:
1. Crea una cuenta en [Formspree](https://formspree.io/)
2. Crea un nuevo formulario
3. Reemplaza el endpoint en los componentes

---

## � Capturas de Pantalla

### Página de Inicio
![Home](./docs/screenshots/home.png)

### Catálogo de Productos
![Products](./docs/screenshots/products.png)

### Carrito de Compras
![Cart](./docs/screenshots/cart.png)

### Checkout
![Checkout](./docs/screenshots/checkout.png)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo
- Usa componentes funcionales con hooks
- Sigue las convenciones de nombres de React
- Documenta funciones complejas
- Mantén los componentes pequeños y reutilizables

---

## � Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## � Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- Diseño inspirado en marcas deportivas líderes
- Iconos de [Lucide](https://lucide.dev/)
- Fuentes de [Google Fonts](https://fonts.google.com/)
- Integración de formularios con [Formspree](https://formspree.io/)

---

## 📞 Contacto

- **Email**: hola@sporta.pe
- **Teléfono**: +51 999 888 777
- **Ubicación**: Lima, Perú

---

<div align="center">
  <p>Hecho con ❤️ para atletas que no aceptan límites</p>
  <p>© 2025 SPORTA - Todos los derechos reservados</p>
</div>
