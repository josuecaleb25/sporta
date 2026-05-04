import { useState } from 'react'

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Configuración de WhatsApp - Dos números
  const WHATSAPP_OPTIONS = [
    {
      id: 1,
      name: 'Ventas',
      number: '51987145336',
      message: '¡Hola! Me gustaría realizar una compra o consultar sobre productos disponibles.',
      icon: '🛍️'
    },
    {
      id: 2,
      name: 'Información / Consultas',
      number: '51960056600',
      message: '¡Hola! Tengo una consulta sobre Sporta.',
      icon: '💬'
    }
  ]

  const handleWhatsAppClick = (option) => {
    const url = `https://wa.me/${option.number}?text=${encodeURIComponent(option.message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowMenu(false)
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9998;
          animation: slideIn 0.5s ease-out, float 3s ease-in-out infinite;
        }

        .whatsapp-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
          border: none;
          position: relative;
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
          animation: pulse 1s ease-in-out infinite;
        }

        .whatsapp-button:active {
          transform: scale(0.95);
        }

        .whatsapp-icon {
          width: 32px;
          height: 32px;
          fill: white;
        }

        .whatsapp-tooltip {
          position: absolute;
          right: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          color: #333;
          padding: 12px 18px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .whatsapp-tooltip.show {
          opacity: 1;
          right: 80px;
        }

        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid white;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }

        .whatsapp-notification {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #FF4500;
          border-radius: 50%;
          border: 3px solid white;
          animation: pulse 2s ease-in-out infinite;
        }

        .whatsapp-menu {
          position: absolute;
          bottom: 75px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          min-width: 220px;
        }

        .whatsapp-menu.show {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .whatsapp-menu-header {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .whatsapp-menu-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
          font-family: 'DM Sans', sans-serif;
        }

        .whatsapp-menu-option:last-child {
          border-bottom: none;
        }

        .whatsapp-menu-option:hover {
          background: #f8f8f8;
        }

        .whatsapp-menu-option:active {
          background: #e8e8e8;
        }

        .whatsapp-menu-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .whatsapp-menu-text {
          flex: 1;
        }

        .whatsapp-menu-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0 0 2px 0;
        }

        .whatsapp-menu-subtitle {
          font-size: 11px;
          color: #666;
          margin: 0;
        }

        .whatsapp-menu-arrow {
          color: #25D366;
          font-size: 18px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
          }

          .whatsapp-button {
            width: 55px;
            height: 55px;
          }

          .whatsapp-icon {
            width: 28px;
            height: 28px;
          }

          .whatsapp-tooltip {
            display: none;
          }
        }
      `}</style>

      <div className="whatsapp-float">
        {/* Menú de opciones */}
        <div className={`whatsapp-menu ${showMenu ? 'show' : ''}`}>
          <div className="whatsapp-menu-header">
            ¿En qué podemos ayudarte?
          </div>
          {WHATSAPP_OPTIONS.map((option) => (
            <div
              key={option.id}
              className="whatsapp-menu-option"
              onClick={() => handleWhatsAppClick(option)}
            >
              <div className="whatsapp-menu-icon">{option.icon}</div>
              <div className="whatsapp-menu-text">
                <p className="whatsapp-menu-title">{option.name}</p>
                <p className="whatsapp-menu-subtitle">
                  {option.id === 1 ? 'Compras y productos' : 'Dudas y consultas'}
                </p>
              </div>
              <div className="whatsapp-menu-arrow">›</div>
            </div>
          ))}
        </div>

        <div
          className={`whatsapp-tooltip ${showTooltip && !showMenu ? 'show' : ''}`}
        >
          ¿Necesitas ayuda? ¡Escríbenos!
        </div>

        <button
          className="whatsapp-button"
          onClick={toggleMenu}
          onMouseEnter={() => {
            setIsHovered(true)
            setShowTooltip(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setShowTooltip(false)
          }}
          aria-label="Contactar por WhatsApp"
          title="Chatea con nosotros"
        >
          {/* Icono de WhatsApp */}
          <svg
            className="whatsapp-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>

          {/* Notificación (punto rojo) */}
          <div className="whatsapp-notification"></div>
        </button>
      </div>
    </>
  )
}

export default WhatsAppButton
