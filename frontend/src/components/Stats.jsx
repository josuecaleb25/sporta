const Stats = () => {
  const stats = [
    { value: '50+', label: 'Modelos Disponibles', icon: '👟' },
    { value: '100K+', label: 'Atletas Satisfechos', icon: '🏆' },
    { value: '70+', label: 'Países', icon: '🌎' },
    { value: '2019', label: 'Fundada en', icon: '📅' },
  ]

  return (
    <>
      <style>{`
        .stats-root {
          background: #0d0d0d;
          padding: 5rem 2rem;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .stats-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,69,0,0.4), transparent);
        }
        .stats-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,69,0,0.15), transparent);
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,69,0,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(255,69,0,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .stat-card:hover::before { opacity: 1; }
        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          display: block;
        }
        .stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          line-height: 1;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #fff 40%, rgba(255,69,0,0.8));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section className="stats-root">
        <div className="stats-inner">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="stat-card">
              <span className="stat-icon">{icon}</span>
              <div className="stat-value">{value}</div>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Stats