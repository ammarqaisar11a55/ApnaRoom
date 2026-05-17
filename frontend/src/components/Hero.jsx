import { useState, useEffect } from 'react'

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
    <section className="pt-32 pb-16 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm font-medium text-blue-600">Pakistan's #1 Student Hostel Platform</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-display text-primary-700 leading-tight">
              Find Your<br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Apna Room</span><br />
              Near Campus
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Verified, affordable, and student-friendly hostels near every major university in Pakistan. Focus on your studies — we'll handle your stay.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                id="searchInput"
                type="text"
                placeholder="Search by university, city, or hostel name..."
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-primary-700 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Search →
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div>
                <h3 className="text-3xl font-bold text-primary-700">{stats.hostels}+</h3>
                <p className="text-gray-600 text-sm">Verified Hostels</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary-700">{stats.cities}</h3>
                <p className="text-gray-600 text-sm">Universities Covered</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary-700">{stats.guests.toLocaleString()}+</h3>
                <p className="text-gray-600 text-sm">Happy Students</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden md:block">
            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-200 to-blue-100 rounded-3xl flex items-center justify-center">
                <img
                  src="/assets/hero.png"
                  alt="Modern student hostel"
                  className="w-4/5 h-4/5 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?w=600&h=600&fit=crop'
                  }}
                />
              </div>

              {/* Float Cards */}
              <div className="absolute top-8 right-0 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDelay: '0s' }}>
                <div className="flex gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <div className="text-xs text-gray-500">Top University</div>
                    <div className="font-semibold text-gray-700">LUMS, Lahore</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-0 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="flex gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="text-xs text-gray-500">Avg. Rating</div>
                    <div className="font-semibold text-gray-700">4.8 ★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
