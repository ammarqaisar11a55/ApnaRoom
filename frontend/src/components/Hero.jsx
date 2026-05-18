import { useState, useEffect } from 'react'
import { assetUrl } from '../utils/assets'

export default function Hero({ onNavigate }) {
  const [stats, setStats] = useState({
    hostels: 0,
    cities: 0,
    guests: 0,
  })

  useEffect(() => {
    const animateCount = (target, callback) => {
      let current = 0
      const increment = target / 30
      const interval = setInterval(() => {
        current += increment
        if (current >= target) {
          callback(target)
          clearInterval(interval)
        } else {
          callback(Math.floor(current))
        }
      }, 50)
    }

    animateCount(500, (val) => setStats((s) => ({ ...s, hostels: val })))
    animateCount(4, (val) => setStats((s) => ({ ...s, cities: val })))
    animateCount(12000, (val) => setStats((s) => ({ ...s, guests: val })))
  }, [])

  const handleSearch = () => {
    const searchInput = document.getElementById('searchInput')?.value
    if (searchInput) {
      alert(`Searching for: ${searchInput}`)
    }
  }

  return (
    <section className="relative px-6 pb-20 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 rounded-full border border-primary-100 bg-white/85 px-4 py-2 shadow-sm">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span className="text-sm font-medium text-primary-600">Pakistan's #1 Student Hostel Platform</span>
              </div>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight text-primary-800 font-display md:text-6xl">
              Where Perfect Spaces Meet the
              <span className="block bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent">Comfort of Home.</span>
            </h1>

            <div className="flex max-w-2xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-card sm:flex-row">
              <input
                id="searchInput"
                type="text"
                placeholder="Search by university, city, or hostel name..."
                className="min-h-12 flex-1 rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleSearch}
                className="min-h-12 rounded-xl bg-gradient-to-r from-primary-700 to-blue-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:shadow-lg active:scale-95"
              >
                Search
              </button>
            </div>

            <div className="grid max-w-2xl grid-cols-3 gap-3 pt-3 sm:gap-6">
              <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm">
                <h3 className="text-3xl font-bold text-primary-700">{stats.hostels}+</h3>
                <p className="text-gray-600 text-sm">Verified Hostels</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm">
                <h3 className="text-3xl font-bold text-primary-700">{stats.cities}</h3>
                <p className="text-gray-600 text-sm">Major Cities</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm">
                <h3 className="text-3xl font-bold text-primary-700">{stats.guests.toLocaleString()}+</h3>
                <p className="text-gray-600 text-sm">Happy Students</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative">
              <div className="aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-blue-100 bg-blue-50 shadow-lg">
                <img
                  src={assetUrl('assets/herosectionrightpic.jpg')}
                  alt="Modern hostel building in the city"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-800/25 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
