export default function Cities() {
  const cities = [
    {
      name: 'Lahore',
      description: '42 Hostels • LUMS, UET, PU, UMT',
      image: '/assets/lahore.png',
      fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Islamabad',
      description: '35 Hostels • NUST, COMSATS, QAU',
      image: '/assets/islamabad.png',
      fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    },
    {
      name: 'Karachi',
      description: '28 Hostels • IBA, NED, FAST',
      image: '/assets/karachi.png',
      fallback: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop',
    },
    {
      name: 'Peshawar',
      description: '18 Hostels • UET, UoP, IMSciences',
      image: '/assets/hunza.png',
      fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    },
  ]

  return (
    <section id="cities" className="py-20 px-6 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Popular Student Cities</h2>
          <p className="section-subtitle">Find hostels near top universities in Pakistan's biggest education hubs.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer reveal"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = city.fallback
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white font-display">{city.name}</h3>
                <p className="text-gray-200 text-sm mt-1">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
