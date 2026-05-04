import { useState, useEffect, useRef } from 'react'

// Email exclusivo del administrador
const ADMIN_EMAIL = 'adminSporta@depor.pe'
const ADMIN_PASSWORD = 'admin123'

// Google Client ID - Configúralo en tu archivo .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'

const Auth = ({ onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Usar ref para mantener el valor actual de isLogin
  const isLoginRef = useRef(isLogin)
  
  // Actualizar la ref cada vez que cambia isLogin
  useEffect(() => {
    isLoginRef.current = isLogin
  }, [isLogin])

  // Inicializar Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && !isAdminEmail) {
        try {
          // Solo inicializar si no se ha inicializado antes
          if (!window.googleSignInInitialized) {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleGoogleResponse,
              auto_select: false,
            })
            window.googleSignInInitialized = true
            console.log('✅ Google Sign-In inicializado correctamente')
          }
        } catch (err) {
          console.error('❌ Error inicializando Google Sign-In:', err)
        }
      }
    }

    // Esperar a que el script de Google se cargue
    if (window.google) {
      initializeGoogleSignIn()
    } else {
      // Reintentar después de un momento
      const timer = setTimeout(initializeGoogleSignIn, 500)
      return () => clearTimeout(timer)
    }
  }, [isLogin])

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true)
    try {
      // Decodificar el JWT de Google para obtener la info del usuario
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      
      // Usar el valor actual de isLogin desde la ref (no el valor capturado en el closure)
      const currentIsLogin = isLoginRef.current
      
      // Usar endpoint diferente según si es login o registro
      const endpoint = currentIsLogin 
        ? `${API_URL}/api/auth/google`           // LOGIN: solo usuarios existentes
        : `${API_URL}/api/auth/google/register`  // REGISTRO: crea usuarios nuevos
      
      console.log('🔍 Estado isLogin:', currentIsLogin)
      console.log('🔍 Endpoint a usar:', endpoint)
      
      // Enviar al backend para validar y registrar/login
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          googleId: payload.sub,
          picture: payload.picture,
        })
      }).then(r => r.json())

      if (result.error) {
        console.error('❌ Error del servidor:', result.error)
        setErrors({ google: result.error })
        setGoogleLoading(false)
        return
      }

      if (result.token && result.user) {
        // Guardar token en localStorage
        localStorage.setItem('sporta_token', result.token)
        
        console.log('✅ Login con Google exitoso:', result.user)
        
        // Llamar a onLogin con los datos del usuario
        onLogin(result.user)
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      } else {
        setErrors({ google: 'Error al procesar la autenticación' })
      }
      
    } catch (err) {
      console.error('❌ Error procesando login de Google:', err)
      setErrors({ google: 'Error al iniciar sesión con Google. Intenta de nuevo.' })
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleClick = () => {
    if (googleLoading) return
    
    if (!window.google) {
      setErrors({ google: 'Google Sign-In no está disponible. Recarga la página.' })
      return
    }

    try {
      setGoogleLoading(true)
      setErrors({ google: '' })
      
      // Renderizar el botón de Google en un contenedor temporal
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.top = '-9999px'
      document.body.appendChild(tempDiv)
      
      window.google.accounts.id.renderButton(tempDiv, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        width: 300
      })
      
      // Hacer clic en el botón renderizado
      setTimeout(() => {
        const googleButton = tempDiv.querySelector('div[role="button"]')
        if (googleButton) {
          googleButton.click()
        } else {
          // Si no funciona el botón, usar prompt
          window.google.accounts.id.prompt((notification) => {
            setGoogleLoading(false)
            
            if (notification.isNotDisplayed()) {
              console.log('Google One Tap no se mostró')
              setErrors({ google: 'No se pudo abrir Google Sign-In. Verifica que hayas configurado correctamente los orígenes autorizados en Google Cloud Console.' })
            } else if (notification.isSkippedMoment()) {
              console.log('Usuario cerró Google One Tap')
              setGoogleLoading(false)
            }
          })
        }
        
        // Limpiar el contenedor temporal después de 2 segundos
        setTimeout(() => {
          if (tempDiv.parentNode) {
            document.body.removeChild(tempDiv)
          }
        }, 2000)
      }, 100)
      
    } catch (err) {
      console.error('Error al abrir Google Sign-In:', err)
      setErrors({ google: 'Error al abrir Google Sign-In. Asegúrate de que http://localhost:5173 esté en los orígenes autorizados de tu Google Client ID.' })
      setGoogleLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'El nombre es requerido'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || 'Error al procesar la solicitud' })
        setLoading(false)
        return
      }

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('sporta_token', data.token)
      }

      // Llamar a onLogin o onRegister con el usuario Y el token
      const userWithToken = { ...data.user, token: data.token }
      isLogin ? onLogin(userWithToken) : onRegister(userWithToken)
      
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error en autenticación:', error)
      setErrors({ general: 'Error de conexión. Verifica que el servidor esté corriendo.' })
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  const isAdminEmail = formData.email === ADMIN_EMAIL

  return (
    <>
      <style>{`
        .auth-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-box {
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          animation: slideInUp 0.3s ease;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-head {
          padding: 1.75rem 1.75rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .auth-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 2px;
          color: #fff;
        }
        .auth-head h2 span { color: #FF4500; }
        .auth-close {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          width: 34px; height: 34px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-close:hover {
          background: rgba(255,69,0,0.15);
          border-color: rgba(255,69,0,0.3);
          color: #FF4500;
          transform: rotate(90deg);
        }
        .auth-admin-badge {
          margin: 1rem 1.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,69,0,0.08);
          border: 1px solid rgba(255,69,0,0.2);
          border-radius: 10px;
          padding: 0.65rem 1rem;
          animation: fadeIn 0.2s ease;
        }
        .auth-admin-badge-icon {
          width: 28px; height: 28px;
          background: #FF4500;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-admin-badge p {
          font-size: 0.78rem;
          color: #FF4500;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
        }
        .auth-admin-badge span {
          font-size: 0.7rem;
          color: rgba(255,69,0,0.6);
          display: block;
          font-weight: 400;
        }
        .auth-tabs {
          display: flex;
          gap: 0;
          margin: 1.5rem 1.75rem 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 3px;
        }
        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 0.5rem;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }
        .auth-tab.active {
          background: #FF4500;
          color: #fff;
          box-shadow: 0 4px 12px rgba(255,69,0,0.3);
        }
        .auth-form {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
        }
        .auth-field input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
        }
        .auth-field input:focus {
          outline: none;
          border-color: rgba(255,69,0,0.5);
          background: rgba(255,69,0,0.04);
          box-shadow: 0 0 0 3px rgba(255,69,0,0.08);
        }
        .auth-field input.err {
          border-color: rgba(255,60,60,0.5);
        }
        .auth-field input.admin-input {
          border-color: rgba(255,69,0,0.35);
          background: rgba(255,69,0,0.04);
        }
        .auth-field input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .auth-err {
          color: #ff6b6b;
          font-size: 0.72rem;
          margin-top: 4px;
          display: block;
        }
        .auth-submit {
          width: 100%;
          background: #FF4500;
          color: #fff;
          border: none;
          padding: 0.9rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.25rem;
        }
        .auth-submit:hover {
          background: #e03d00;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255,69,0,0.35);
        }
        .auth-submit.admin-btn {
          background: linear-gradient(135deg, #FF4500, #ff6a35);
          letter-spacing: 1.5px;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.75rem;
          margin-bottom: 0.5rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .auth-divider span {
          color: rgba(255,255,255,0.25);
          font-size: 0.72rem;
          white-space: nowrap;
        }
        .auth-google {
          margin: 0 1.75rem 1.75rem;
          width: calc(100% - 3.5rem);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.2s ease;
        }
        .auth-google:hover:not(:disabled) {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          color: #fff;
        }
        .auth-google:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="auth-box">
          <div className="auth-head">
            <h2>SPORT<span>A</span></h2>
            <button className="auth-close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Badge de admin cuando detecta el email */}
          {isAdminEmail && isLogin && (
            <div className="auth-admin-badge">
              <div className="auth-admin-badge-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p>Acceso de Administrador
                  <span>Panel de control exclusivo</span>
                </p>
              </div>
            </div>
          )}

          {/* Tabs solo si no es admin */}
          {!isAdminEmail && (
            <div className="auth-tabs">
              <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => !isLogin && switchMode()}>
                Ingresar
              </button>
              <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => isLogin && switchMode()}>
                Registrarse
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-field">
                <label>Nombre completo</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Tu nombre"
                  className={errors.name ? 'err' : ''}
                />
                {errors.name && <span className="auth-err">{errors.name}</span>}
              </div>
            )}
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="tu@email.com"
                className={`${errors.email ? 'err' : ''} ${isAdminEmail ? 'admin-input' : ''}`}
              />
              {errors.email && <span className="auth-err">{errors.email}</span>}
            </div>
            <div className="auth-field">
              <label>Contraseña</label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Mínimo 6 caracteres"
                className={`${errors.password ? 'err' : ''} ${isAdminEmail ? 'admin-input' : ''}`}
              />
              {errors.password && <span className="auth-err">{errors.password}</span>}
            </div>
            {!isLogin && (
              <div className="auth-field">
                <label>Confirmar contraseña</label>
                <input
                  type="password" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Repite tu contraseña"
                  className={errors.confirmPassword ? 'err' : ''}
                />
                {errors.confirmPassword && <span className="auth-err">{errors.confirmPassword}</span>}
              </div>
            )}
            <button type="submit" className={`auth-submit ${isAdminEmail ? 'admin-btn' : ''}`}>
              {isAdminEmail ? 'Acceder como Admin' : isLogin ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          {/* Google OAuth solo para usuarios normales */}
          {!isAdminEmail && (
            <>
              <div className="auth-divider"><span>o continúa con</span></div>
              <button 
                className="auth-google" 
                onClick={handleGoogleClick}
                disabled={googleLoading}
                type="button"
              >
                {googleLoading ? (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" opacity="0.3"/>
                    </svg>
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24">
                      <path d="M21.8 10.04H21V10H12v4h5.65C16.83 16.33 14.61 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.53 0 2.92.58 3.98 1.52L18.81 4.7C17.02 3.03 14.63 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.67-.07-1.33-.2-1.96z" fill="#4285F4"/>
                      <path d="M3.15 7.35L6.44 9.75C7.33 7.55 9.48 6 12 6c1.53 0 2.92.58 3.98 1.52L18.81 4.7C17.02 3.03 14.63 2 12 2 8.16 2 4.83 4.17 3.15 7.35z" fill="#EA4335"/>
                      <path d="M12 22c2.58 0 4.93-1 6.7-2.6l-3.09-2.62A5.95 5.95 0 0112 18c-2.6 0-4.81-1.66-5.64-3.97L3.1 16.54C4.75 19.78 8.11 22 12 22z" fill="#34A853"/>
                      <path d="M21.8 10.04H21V10H12v4h5.65a6.01 6.01 0 01-2.04 2.79l3.1 2.62C18.49 19.6 22 17 22 12c0-.67-.07-1.33-.2-1.96z" fill="#FBBC05"/>
                    </svg>
                    Continuar con Google
                  </>
                )}
              </button>
              {errors.google && (
                <p style={{ color: '#ff6b6b', fontSize: '0.75rem', textAlign: 'center', margin: '-0.5rem 1.75rem 1rem', lineHeight: '1.4' }}>
                  {errors.google}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Auth