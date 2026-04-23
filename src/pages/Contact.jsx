import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../styles/Contact.css';

const Contact = ({ darkMode }) => {
  const [state, handleSubmit] = useForm("xblzqqlw");

  if (state.succeeded) {
    return (
      <div className={`contact-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className={`success-message ${darkMode ? 'dark-mode' : ''}`}>
          <h2>¡Mensaje Enviado!</h2>
          <p>Gracias por contactarnos. Te responderemos pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`contact-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`contact-container ${darkMode ? 'dark-mode' : ''}`}>
        <h1>Contacto Adidas</h1>
        <p>¿Tienes preguntas sobre nuestros productos? Escríbenos</p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${darkMode ? 'dark-mode' : ''}`}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${darkMode ? 'dark-mode' : ''}`}
              placeholder="tu@email.com"
              required
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
              className="error-message"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              className={`form-textarea ${darkMode ? 'dark-mode' : ''}`}
              rows="6"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>
            <ValidationError 
              prefix="Message" 
              field="message"
              errors={state.errors}
              className="error-message"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${darkMode ? 'dark-mode' : ''}`}
            disabled={state.submitting}
          >
            {state.submitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;