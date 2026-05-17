import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ scrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-350 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3'
        : 'bg-white/75 backdrop-blur-xl py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
          <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
            <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#1e3a5f" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-black text-primary-700 font-display">
            Apna<span className="text-blue-500">Room</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><a href="#cities" onClick={(e) => handleScrollTo(e, '#cities')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">Cities</a></li>
          <li><a href="#how-it-works" onClick={(e) => handleScrollTo(e, '#how-it-works')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">How It Works</a></li>
          <li><a href="#features" onClick={(e) => handleScrollTo(e, '#features')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">Why Us</a></li>
          <li><a href="#testimonials" onClick={(e) => handleScrollTo(e, '#testimonials')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">Reviews</a></li>
          <li><Link to="/login" className="px-4 py-2 text-primary-700 border-2 border-primary-700 rounded-full font-semibold hover:bg-primary-50 transition-colors">Login</Link></li>
          <li><Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-primary-700 to-blue-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all">Sign Up Free</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Open menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 mt-4 py-4 px-6 space-y-4">
          <a href="#cities" onClick={(e) => handleScrollTo(e, '#cities')} className="block text-gray-700 hover:text-primary-700 font-medium py-2">Cities</a>
          <a href="#how-it-works" onClick={(e) => handleScrollTo(e, '#how-it-works')} className="block text-gray-700 hover:text-primary-700 font-medium py-2">How It Works</a>
          <a href="#features" onClick={(e) => handleScrollTo(e, '#features')} className="block text-gray-700 hover:text-primary-700 font-medium py-2">Why Us</a>
          <a href="#testimonials" onClick={(e) => handleScrollTo(e, '#testimonials')} className="block text-gray-700 hover:text-primary-700 font-medium py-2">Reviews</a>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-primary-700 font-medium py-2">Login</Link>
          <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-2 bg-gradient-to-r from-primary-700 to-blue-500 text-white rounded-full font-semibold text-center">Sign Up Free</Link>
        </div>
      )}
    </nav>
  )
}
