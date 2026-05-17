import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBlobs from '../components/AnimatedBlobs'

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, role })
      })
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('apnaroom_token', data.token)
        localStorage.setItem('apnaroom_user', JSON.stringify(data.user))
        alert(`Welcome back, ${data.user.name}!`)
        navigate('/')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatedBlobs />
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-700 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          </div>
          <div className="relative z-10">
            <a href="/" onClick={() => handleNavClick('home')} className="flex items-center gap-2 mb-12">
              <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#lg1)" />
                <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#1e3a5f" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-black font-display">
                Apna<span className="text-blue-300">Room</span>
              </span>
            </a>
            <h2 className="text-4xl font-bold mb-4 font-display">Welcome Back! 👋</h2>
            <p className="text-blue-100 mb-8">Access your student dashboard, manage bookings, or check your hostel listings.</p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎓</span>
                <div>
                  <div className="font-semibold">500+ verified student hostels</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="font-semibold">Near every major university</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="font-semibold">100% safe & trusted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#lg1-mobile)" />
                <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
                <defs>
                  <linearGradient id="lg1-mobile" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#1e3a5f" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-black text-primary-700 font-display">
                Apna<span className="text-blue-500">Room</span>
              </span>
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-primary-700 font-display mb-2">Login to ApnaRoom</h1>
              <p className="text-gray-600">Choose your account type to get started</p>
            </div>

            {/* Role Tabs */}
            <div className="flex gap-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setRole('student')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setRole('owner')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  role === 'owner'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏠 Hostel Owner
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg">✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@university.edu.pk"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-lg hover:opacity-70"
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary-700 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-70"
              >
                {isLoading ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-medium">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.6-.4-3.9z" />
                </svg>
                Google
              </button>
              <button className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-medium">
                📱 Phone
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Sign up free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
