import { useState } from 'react'

const Auth = ({ onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El email no es válido'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const userData = {
      id: Date.now(),
      name: isLogin ? formData.email.split('@')[0] : formData.name,
      email: formData.email,
      loginDate: new Date().toLocaleDateString()
    }
    isLogin ? onLogin(userData) : onRegister(userData)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  const inputBase = "w-full px-4 py-3 rounded-xl border-2 bg-black text-white text-base font-sans transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
  const inputError = "border-red-600"
  const inputNormal = "border-white/20"

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center animate-[fadeIn_0.3s_ease]">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border-2 border-white/10 shadow-2xl animate-[slideUp_0.3s_ease] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h2 className="text-white text-xl font-bold" style={{fontFamily: 'Orbitron, sans-serif'}}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="text-white p-2 rounded-md transition-all duration-300 hover:bg-red-600 hover:rotate-90 cursor-pointer bg-transparent border-none"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-semibold mb-1.5">Nombre Completo</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-semibold mb-1.5">Email</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="tu@email.com"
              className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-1.5">Contraseña</label>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-semibold mb-1.5">Confirmar Contraseña</label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                placeholder="Repite tu contraseña"
                className={`${inputBase} ${errors.confirmPassword ? inputError : inputNormal}`}
              />
              {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold uppercase tracking-wide text-base cursor-pointer border-none mt-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Footer */}
        <div className="px-7 pb-4 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button onClick={switchMode} className="text-blue-500 font-semibold ml-1 underline bg-transparent border-none cursor-pointer hover:text-blue-400 transition-colors">
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="relative px-7 pb-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="text-gray-500 text-sm">o continúa con</span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>

        {/* Google */}
        <div className="px-7 pb-6">
          <button className="w-full flex items-center justify-center gap-3 bg-black border-2 border-white/20 text-white py-3 rounded-xl font-semibold cursor-pointer hover:border-blue-600 hover:-translate-y-0.5 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
              <path d="M3.153 7.3455L6.4385 9.755C7.3275 7.554 9.4805 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.159 2 4.828 4.1685 3.153 7.3455Z" fill="#FF3D00"/>
              <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.399 18 7.1905 16.3415 6.3585 14.027L3.0975 16.5395C4.7525 19.778 8.1135 22 12 22Z" fill="#4CAF50"/>
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
            </svg>
            Google
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

export default Auth