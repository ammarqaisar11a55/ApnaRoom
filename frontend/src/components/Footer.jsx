import { Link } from 'react-router-dom'

export default function Footer({ onNavigate }) {
  const handleNavClick = (e, page) => {
    if (onNavigate) {
      e.preventDefault()
      onNavigate(page)
    }
  }

  return (
    <footer className="bg-primary-700 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#logoGrad2)" />
                <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
                <defs>
                  <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#1e3a5f" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-black font-display">
                Apna<span className="text-blue-300">Room</span>
              </span>
            </a>
            <p className="text-blue-100 text-sm">
              Pakistan's most trusted student hostel platform. Connecting students with affordable, verified, and comfortable hostels since 2024.
            </p>
            <div className="flex gap-3">
              {['f', 'ig', 'x', 'yt'].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/50 text-xs font-bold uppercase text-blue-100 transition-colors hover:border-blue-300 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#cities" className="hover:text-white transition-colors">Popular Cities</a></li>
              <li><a href="#cities" className="hover:text-white transition-colors">Lahore Hostels</a></li>
              <li><a href="#cities" className="hover:text-white transition-colors">Islamabad Hostels</a></li>
              <li><a href="#cities" className="hover:text-white transition-colors">Karachi Hostels</a></li>
              <li><a href="#cities" className="hover:text-white transition-colors">Peshawar Hostels</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="/signup" className="hover:text-white transition-colors">List a Hostel</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-600 pt-8">
          <p className="text-center text-blue-100">
            © 2024 ApnaRoom. Built in Pakistan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
