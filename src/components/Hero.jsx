import { useState, useEffect, useRef } from 'react'
import '../styles/Hero.css'

const Hero = () => {
  const [currentModel, setCurrentModel] = useState(0)
  const scrollRef = useRef(null)
  const carouselRef = useRef(null)
  
  const models = [
    {
      id: 1,
      name: "Ultraboost 22",
      category: "Running",
      image: "/src/assets/modelo1.png"
    },
    {
      id: 2,
      name: "NMD_R1",
      category: "Lifestyle",
      image: "/src/assets/modelo2.png"
    },
    {
      id: 3,
      name: "Superstar",
      category: "Originals",
      image: "/src/assets/modelo3.png"
    },
    {
      id: 4,
      name: "Stan Smith",
      category: "Classic",
      image: "/src/assets/modelo4.png"
    },
    {
      id: 5,
      name: "Gazelle",
      category: "Retro",
      image: "/src/assets/modelo5.png"
    }
  ]

  // Auto-scroll cada 5 segundos (aumenté el tiempo para que no sea tan intrusivo)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModel(prev => (prev + 1) % models.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [models.length])

  // Efecto para desplazar SOLO el carrusel, no toda la página
  useEffect(() => {
    if (carouselRef.current) {
      const scrollContainer = carouselRef.current;
      const modelElement = scrollContainer.children[currentModel];
      if (modelElement) {
        const scrollLeft = modelElement.offsetLeft - (scrollContainer.offsetWidth / 2) + (modelElement.offsetWidth / 2);
        
        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentModel])

  const handleManualScroll = (index) => {
    setCurrentModel(index)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY > 0) {
      setCurrentModel(prev => Math.min(prev + 1, models.length - 1))
    } else {
      setCurrentModel(prev => Math.max(prev - 1, 0))
    }
  }

  // Manejar scroll manual con touch/swipe
  const handleScroll = (e) => {
    // Puedes agregar lógica para detectar scroll manual si lo deseas
  }

  return (
    <section className="hero">
      {/* Carrusel de Modelos - IZQUIERDA */}
      <div className="hero-carousel">
        <div className="carousel-container">
          <div 
            className="carousel-content"
            ref={carouselRef}
            onWheel={handleWheel}
            onScroll={handleScroll}
          >
            {models.map((model, index) => (
              <div 
                key={model.id} 
                className={`carousel-item ${index === currentModel ? 'active' : ''}`}
                onClick={() => handleManualScroll(index)}
              >
                <div className="carousel-image">
                  <img src={model.image} alt={model.name} />
                  {index === currentModel && <div className="active-indicator"></div>}
                </div>
                <div className="carousel-info">
                  <div className="carousel-name">{model.name}</div>
                  <div className="carousel-category">{model.category}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {models.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentModel ? 'active' : ''}`}
                onClick={() => handleManualScroll(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de Bienvenida - DERECHA */}
      <div className="hero-content">
        <h1 className="hero-title">ADIDAS</h1>
        <p className="hero-subtitle">LA EXCELENCIA NO ES UN DESTINO, ES UN CAMINO</p>
        <p className="hero-description">
          Donde el rendimiento se encuentra con la elegancia. Experimenta la fusión perfecta 
          entre tecnología de alto desempeño y diseño que redefine el estilo urbano-deportivo.
        </p>
        <button className="cta-button">Explorar Colección</button>
      </div>
    </section>
  )
}

export default Hero