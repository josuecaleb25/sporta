const Stats = () => {
  const stats = [
    { value: '50+', label: 'Modelos Disponibles' },
    { value: '100K+', label: 'Clientes Satisfechos' },
    { value: '70+', label: 'Países' },
    { value: '1949', label: 'Desde' },
  ]

  return (
    <section className="py-20 px-5 bg-black text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 text-center">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="p-8 bg-white/5 rounded-2xl backdrop-blur border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:border-blue-600"
          >
            <h3
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent"
              style={{fontFamily: 'Orbitron, sans-serif'}}
            >
              {value}
            </h3>
            <p className="text-gray-300 uppercase tracking-widest text-sm font-medium m-0">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats