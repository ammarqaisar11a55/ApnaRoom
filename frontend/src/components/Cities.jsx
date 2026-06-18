import { useNavigate } from 'react-router-dom'
import { assetUrl } from '../utils/assets'

export default function Cities() {
  const navigate = useNavigate()
  const cities = [
    {
      name: 'Lahore',
      description: '42 Hostels • LUMS, UET, PU, UMT',
      image: assetUrl('assets/lahore.png'),
    },
    {
      name: 'Islamabad',
      description: '35 Hostels • NUST, COMSATS, QAU',
      image: assetUrl('assets/islamabad.png'),
    },
    {
      name: 'Karachi',
      description: '28 Hostels • IBA, NED, FAST',
      image: assetUrl('assets/karachi.png'),
    },
    {
      name: 'Peshawar',
      description: '18 Hostels • UET, UoP, IMSciences',
      image: assetUrl('assets/hunza.png'),
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
              onClick={() => navigate(`/hostels?city=${city.name}`)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg reveal"
            >
              <img
                src={city.image}
                alt={`${city.name} student hostels`}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-800/85 via-primary-800/20 to-transparent p-6">
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

