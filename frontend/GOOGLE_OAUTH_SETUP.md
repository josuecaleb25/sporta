# 🔐 CONFIGURACIÓN DE GOOGLE OAUTH

## 📋 ESTADO ACTUAL

✅ **Google Sign-In está implementado** en el componente Auth.jsx
⚠️ **Necesitas configurar tu Google Client ID**

---

## 🚀 CÓMO OBTENER TU GOOGLE CLIENT ID

### Paso 1: Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google

### Paso 2: Crear un Proyecto
1. Haz clic en el selector de proyectos (arriba a la izquierda)
2. Clic en "Nuevo Proyecto"
3. Nombre: **Sporta E-Commerce**
4. Clic en "Crear"

### Paso 3: Habilitar Google Sign-In API
1. En el menú lateral, ve a: **APIs y servicios > Biblioteca**
2. Busca: **Google+ API** o **Google Identity**
3. Haz clic en "Habilitar"

### Paso 4: Crear Credenciales OAuth
1. Ve a: **APIs y servicios > Credenciales**
2. Clic en **"+ CREAR CREDENCIALES"**
3. Selecciona: **ID de cliente de OAuth 2.0**

### Paso 5: Configurar Pantalla de Consentimiento
Si es la primera vez:
1. Clic en **"CONFIGURAR PANTALLA DE CONSENTIMIENTO"**
2. Selecciona: **Externo** (para pruebas)
3. Completa:
   - Nombre de la aplicación: **Sporta**
   - Correo de asistencia: tu email
   - Logo: (opcional)
4. Clic en **"Guardar y continuar"**
5. En "Ámbitos", clic en **"Guardar y continuar"**
6. En "Usuarios de prueba", agrega tu email
7. Clic en **"Guardar y continuar"**

### Paso 6: Crear el Client ID
1. Vuelve a **Credenciales > + CREAR CREDENCIALES > ID de cliente de OAuth 2.0**
2. Tipo de aplicación: **Aplicación web**
3. Nombre: **Sporta Frontend**
4. **Orígenes de JavaScript autorizados:**
   ```
   http://localhost:5173
   http://localhost:3000
   ```
5. **URIs de redireccionamiento autorizados:**
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. Clic en **"Crear"**

### Paso 7: Copiar el Client ID
1. Se mostrará un modal con tu **Client ID**
2. Copia el Client ID (algo como: `1234567890-abc...xyz.apps.googleusercontent.com`)
3. Guárdalo en un lugar seguro

---

## 🔧 CONFIGURAR EN TU PROYECTO

### Opción 1: Editar directamente Auth.jsx
Abre `frontend/src/components/Auth.jsx` y reemplaza:

```javascript
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
```

Por tu Client ID real:

```javascript
const GOOGLE_CLIENT_ID = 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com'
```

### Opción 2: Usar variable de entorno (Recomendado)
1. Crea o edita `frontend/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
   ```

2. En `Auth.jsx`, cambia:
   ```javascript
   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abc...xyz.apps.googleusercontent.com'
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🧪 PROBAR EL LOGIN CON GOOGLE

### Modo Desarrollo (Sin Client ID)
Si no tienes el Client ID configurado, el botón funcionará en **modo simulación**:
- Haz clic en "Continuar con Google"
- Se creará un usuario de prueba automáticamente
- Verás en la consola: `🔄 Simulando login con Google (modo desarrollo)`

### Modo Producción (Con Client ID)
Una vez configurado el Client ID:
1. Haz clic en "Continuar con Google"
2. Se abrirá el popup de Google
3. Selecciona tu cuenta de Google
4. Acepta los permisos
5. ¡Listo! Estarás logueado

---

## 🔍 VERIFICAR QUE FUNCIONA

### En la Consola del Navegador (F12)
Deberías ver:
```
✅ Login con Google exitoso: {name: "...", email: "..."}
```

### En Network (F12 > Network)
Si tienes el Client ID configurado, verás peticiones a:
- `accounts.google.com`
- `oauth2.googleapis.com`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ "Google Sign-In no está disponible"
**Solución:** Recarga la página (Ctrl + R)

### ❌ No se abre el popup de Google
**Causas:**
1. Bloqueador de popups activado
2. Client ID incorrecto
3. Origen no autorizado

**Solución:**
1. Permite popups en tu navegador
2. Verifica el Client ID en Auth.jsx
3. Verifica que `http://localhost:5173` esté en los orígenes autorizados

### ❌ "redirect_uri_mismatch"
**Solución:**
1. Ve a Google Cloud Console > Credenciales
2. Edita tu Client ID
3. Agrega `http://localhost:5173` a los URIs de redireccionamiento

### ❌ "Access blocked: This app's request is invalid"
**Solución:**
1. Completa la pantalla de consentimiento
2. Agrega tu email como usuario de prueba
3. Verifica que la API esté habilitada

---

## 📊 FLUJO COMPLETO

```
Usuario hace clic en "Continuar con Google"
    ↓
Se abre popup de Google (o One Tap)
    ↓
Usuario selecciona cuenta y acepta permisos
    ↓
Google devuelve un JWT con la info del usuario
    ↓
Frontend decodifica el JWT
    ↓
Se crea el usuario en el estado de la app
    ↓
Usuario queda logueado
```

---

## 🎯 MODO SIMULACIÓN (ACTUAL)

Mientras no configures el Client ID, el botón funciona en **modo simulación**:

```javascript
const mockGoogleUser = {
  id: Date.now(),
  name: 'Usuario Google',
  email: 'usuario@gmail.com',
  role: 'user',
  picture: 'https://via.placeholder.com/150',
}
```

Esto te permite probar la funcionalidad sin necesidad de configurar Google OAuth.

---

## ✅ CHECKLIST

- [ ] Crear proyecto en Google Cloud Console
- [ ] Habilitar Google Sign-In API
- [ ] Configurar pantalla de consentimiento
- [ ] Crear Client ID OAuth 2.0
- [ ] Agregar orígenes autorizados (localhost:5173)
- [ ] Copiar Client ID
- [ ] Pegar Client ID en Auth.jsx o .env
- [ ] Reiniciar servidor de desarrollo
- [ ] Probar login con Google
- [ ] Verificar en consola del navegador

---

## 📚 RECURSOS

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

## 💡 NOTA IMPORTANTE

**Para desarrollo local**, el modo simulación es suficiente.
**Para producción**, necesitas configurar el Client ID real.

El código ya está listo, solo necesitas el Client ID de Google.
