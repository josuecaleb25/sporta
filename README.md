# 🛍️ Adidas E-Commerce - React

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)

**Una moderna tienda online de productos Adidas desarrollada con React**

[![Demo](https://img.shields.io/badge/🚀_Ver_Demo-Live_Site-0066cc?style=for-the-badge)](https://tudominio.com)
[![Report Bug](https://img.shields.io/badge/🐛_Reportar_Bug-GitHub_Issues-ff6b6b?style=for-the-badge)](https://github.com/tuusuario/app-productos-adidas/issues)
[![License](https://img.shields.io/badge/📄_Licencia-MIT-green?style=for-the-badge)](LICENSE)

</div>

## 📖 Descripción

E-commerce completo de productos Adidas con diseño moderno y responsive. Incluye catálogo de productos, carrito de compras, sistema de autenticación y modo oscuro.

## ✨ Características Principales

### 🎯 Funcionalidades
- **🛒 Carrito de Compras** - Gestión completa de productos
- **🔐 Autenticación de Usuarios** - Sistema de login/registro
- **🌙 Modo Oscuro/Claro** - Interfaz adaptable
- **📱 Diseño Responsive** - Optimizado para todos los dispositivos
- **🔍 Búsqueda y Filtros** - Navegación intuitiva
- **📧 Formulario de Contacto** - Integrado con Formspree

### 🛡️ Seguridad
- **Protección de Rutas** - Solo usuarios autenticados pueden comprar
- **Validación de Formularios** - Entradas seguras y validadas
- **Gestión de Estado** - Estado del carrito persistente

## 🎥 Demo Visual

### 📸 Capturas de Pantalla

| Modo Claro | Modo Oscuro | Carrito |
|------------|-------------|---------|
| <img src="screenshots/light-mode.png" width="200"> | <img src="screenshots/dark-mode.png" width="200"> | <img src="screenshots/cart.png" width="200"> |

| Productos | Autenticación | Checkout |
|-----------|---------------|----------|
| <img src="screenshots/products.png" width="200"> | <img src="screenshots/auth.png" width="200"> | <img src="screenshots/checkout.png" width="200"> |

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### 📥 Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tuusuario/app-productos-adidas.git
cd app-productos-adidas
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

5. **Abre tu navegador**
```
http://localhost:5173
```

### 🏗️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Vista previa del build
npm run lint         # Análisis de código
```

## 🏗️ Estructura del Proyecto

```
app-productos/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx      # Barra de navegación
│   │   ├── ProductCard.jsx # Tarjeta de producto
│   │   ├── Cart.jsx        # Modal del carrito
│   │   └── Auth.jsx        # Modal de autenticación
│   ├── pages/              # Páginas principales
│   │   ├── Products.jsx    # Catálogo de productos
│   │   ├── ProductDetail.jsx
│   │   ├── Contact.jsx
│   │   └── Checkout.jsx
│   ├── styles/             # Archivos CSS
│   ├── assets/             # Imágenes y recursos
│   └── App.jsx             # Componente principal
├── public/
└── package.json
```

## 🎨 Personalización

### Colores Principales
```css
--primary-color: #000000;      /* Negro Adidas */
--accent-color: #0066cc;       /* Azul corporativo */
--text-color: #333333;
--background-light: #ffffff;
--background-dark: #1a1a1a;
```

### Configuración de Formspree
1. Regístrate en [Formspree](https://formspree.io)
2. Crea un nuevo formulario
3. Reemplaza el formId en `Contact.jsx`
4. Configura tu email de destino

## 🤝 Contribución

¡Las contribuciones son bienvenidas! 

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Integración con pasarela de pago
- [ ] Sistema de reviews y ratings
- [ ] Wishlist de productos
- [ ] Historial de pedidos
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)

## 🐛 Solución de Problemas

### Problemas Comunes

**Error: Módulo no encontrado**
```bash
npm install
```

**El formulario de contacto no envía emails**
- Verifica la configuración de Formspree
- Revisa la consola del navegador para errores

**Los estilos no se cargan**
```bash
npm run build
```

## 📊 Métricas del Proyecto

![Tamaño del código](https://img.shields.io/github/languages/code-size/tuusuario/app-productos-adidas)
![Último commit](https://img.shields.io/github/last-commit/tuusuario/app-productos-adidas)
![Issues](https://img.shields.io/github/issues/tuusuario/app-productos-adidas)

## 👨‍💻 Desarrollo

### Tecnologías Utilizadas
- **Frontend:** React, Vite, CSS3
- **Estado:** React Hooks (useState, useEffect)
- **Formularios:** Formspree
- **Iconos:** SVG inline
- **Build Tool:** Vite

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Si tienes preguntas o necesitas ayuda:

1. 📖 Revisa esta documentación
2. 🐛 [Abre un issue](https://github.com/tuusuario/app-productos-adidas/issues)
3. 💬 Contáctame directamente

## 🌟 ¡Dale una estrella!

Si este proyecto te fue útil, ¡considera darle una estrella en GitHub!

---

<div align="center">

**Desarrollado con ❤️ usando React**

[⬆ Volver al inicio](#-adidas-e-commerce---react)

</div>