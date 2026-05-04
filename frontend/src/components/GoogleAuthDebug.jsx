import { useEffect, useState } from 'react'

/**
 * Componente de diagnóstico para Google OAuth
 * Muestra información útil para debuggear problemas de autenticación
 */
const GoogleAuthDebug = () => {
  const [diagnostics, setDiagnostics] = useState({
    googleScriptLoaded: false,
    clientIdConfigured: false,
    clientId: '',
    currentOrigin: '',
    cookiesEnabled: false,
    popupsAllowed: null,
  })

  useEffect(() => {
    const checkDiagnostics = async () => {
      // 1. Verificar si el script de Google está cargado
      const googleScriptLoaded = !!window.google

      // 2. Verificar si el Client ID está configurado
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
      const clientIdConfigured = clientId && clientId !== 'your_google_client_id.apps.googleusercontent.com'

      // 3. Obtener el origen actual
      const currentOrigin = window.location.origin

      // 4. Verificar si las cookies están habilitadas
      const cookiesEnabled = navigator.cookieEnabled

      // 5. Intentar verificar si los popups están permitidos
      let popupsAllowed = null
      try {
        const popup = window.open('', '', 'width=1,height=1')
        if (popup) {
          popupsAllowed = true
          popup.close()
        } else {
          popupsAllowed = false
        }
      } catch (e) {
        popupsAllowed = false
      }

      setDiagnostics({
        googleScriptLoaded,
        clientIdConfigured,
        clientId,
        currentOrigin,
        cookiesEnabled,
        popupsAllowed,
      })
    }

    // Esperar un momento para que el script de Google se cargue
    setTimeout(checkDiagnostics, 1000)
  }, [])

  const testGoogleAuth = () => {
    if (!window.google) {
      alert('❌ El script de Google no está cargado. Recarga la página.')
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: diagnostics.clientId,
        callback: (response) => {
          console.log('✅ Google Auth Response:', response)
          alert('✅ Google Auth funcionó correctamente!')
        },
      })

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.error('❌ Google One Tap no se mostró:', notification.getNotDisplayedReason())
          alert(`❌ Google One Tap no se mostró: ${notification.getNotDisplayedReason()}`)
        } else if (notification.isSkippedMoment()) {
          console.log('⚠️ Usuario cerró Google One Tap')
          alert('⚠️ Cerraste el popup de Google')
        }
      })
    } catch (err) {
      console.error('❌ Error al inicializar Google Auth:', err)
      alert(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#1a1a1a',
      border: '2px solid #333',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '400px',
      color: '#fff',
      fontSize: '13px',
      zIndex: 9999,
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#FF4500', fontSize: '16px' }}>
        🔍 Diagnóstico Google OAuth
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <DiagnosticItem
          label="Script de Google cargado"
          value={diagnostics.googleScriptLoaded}
        />
        <DiagnosticItem
          label="Client ID configurado"
          value={diagnostics.clientIdConfigured}
        />
        <DiagnosticItem
          label="Cookies habilitadas"
          value={diagnostics.cookiesEnabled}
        />
        <DiagnosticItem
          label="Popups permitidos"
          value={diagnostics.popupsAllowed}
        />
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#2a2a2a', 
        borderRadius: '6px',
        fontSize: '11px',
        wordBreak: 'break-all'
      }}>
        <strong>Origen actual:</strong><br />
        <code style={{ color: '#4CAF50' }}>{diagnostics.currentOrigin}</code>
      </div>

      <div style={{ 
        marginTop: '10px', 
        padding: '10px', 
        background: '#2a2a2a', 
        borderRadius: '6px',
        fontSize: '11px',
        wordBreak: 'break-all'
      }}>
        <strong>Client ID:</strong><br />
        <code style={{ color: '#2196F3' }}>
          {diagnostics.clientId || 'No configurado'}
        </code>
      </div>

      <button
        onClick={testGoogleAuth}
        style={{
          marginTop: '15px',
          width: '100%',
          padding: '10px',
          background: '#FF4500',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
        }}
      >
        🧪 Probar Google Auth
      </button>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#2a2a2a', 
        borderRadius: '6px',
        fontSize: '11px',
        lineHeight: '1.6'
      }}>
        <strong style={{ color: '#FFC107' }}>⚠️ Pasos para solucionar:</strong><br />
        1. Ve a Google Cloud Console<br />
        2. Agrega <code style={{ color: '#4CAF50' }}>{diagnostics.currentOrigin}</code> a los orígenes autorizados<br />
        3. Guarda y espera 5 minutos<br />
        4. Recarga esta página
      </div>
    </div>
  )
}

const DiagnosticItem = ({ label, value }) => {
  const getIcon = () => {
    if (value === null) return '⏳'
    return value ? '✅' : '❌'
  }

  const getColor = () => {
    if (value === null) return '#FFC107'
    return value ? '#4CAF50' : '#f44336'
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      padding: '8px',
      background: '#2a2a2a',
      borderRadius: '6px'
    }}>
      <span style={{ fontSize: '16px' }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ 
        color: getColor(), 
        fontWeight: 'bold',
        fontSize: '11px'
      }}>
        {value === null ? 'Verificando...' : value ? 'OK' : 'ERROR'}
      </span>
    </div>
  )
}

export default GoogleAuthDebug
