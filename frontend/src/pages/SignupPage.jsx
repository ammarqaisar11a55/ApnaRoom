import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBlobs from '../components/AnimatedBlobs'

export default function SignupPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    hostelName: '',
    city: '',
    password: '',
    agreeTerms: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'password') {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.agreeTerms) {
      setError('Please agree to Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role
      }
      
      if (role === 'student') {
        payload.university = formData.university
      } else {
        payload.hostelName = formData.hostelName
        payload.city = formData.city
      }

      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('apnaroom_token', data.token)
        localStorage.setItem('apnaroom_user', JSON.stringify(data.user))
        alert(`Account created! Welcome, ${data.user.name}!`)
        navigate('/')
      } else {
        setError(data.error || 'Signup failed')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength === 2) return 'bg-yellow-500'
    if (passwordStrength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatedBlobs />
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-700 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
          </div>
          <div className="relative z-10">
            <a href="/" onClick={() => handleNavClick('home')} className="flex items-center gap-2 mb-12">
              <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#lg2)" />
                <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
                <defs>
                  <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#1e3a5f" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-black font-display">
                Apna<span className="text-blue-300">Room</span>
              </span>
            </a>
            <h2 className="text-4xl font-bold mb-4 font-display">Join ApnaRoom! 🚀</h2>
            <p className="text-blue-100 mb-8">Create your free account and find your perfect room — or list your hostel to reach thousands of students.</p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-semibold">Instant booking confirmation</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">💰</span>
                <div>
                  <div className="font-semibold">No signup or booking fees</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🤝</span>
                <div>
                  <div className="font-semibold">Trusted by 12,000+ students</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md space-y-8 py-8">
            {/* Header */}
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="url(#lg2-mobile)" />
                <path d="M20 8L8 18H12V30H18V23H22V30H28V18H32L20 8Z" fill="white" />
                <defs>
                  <linearGradient id="lg2-mobile" x1="0" y1="0" x2="40" y2="40">
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
              <h1 className="text-3xl font-bold text-primary-700 font-display mb-2">Create Your Account</h1>
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Muhammad Ali"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92 3XX XXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Student Field */}
              {role === 'student' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-lg">🎓</span>
                    <select
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select your university</option>
                      <option>NUST, Islamabad</option>
                      <option>LUMS, Lahore</option>
                      <option>FAST-NUCES</option>
                      <option>COMSATS University</option>
                      <option>Punjab University</option>
                      <option>UET Lahore</option>
                      <option>IBA Karachi</option>
                      <option>NED University</option>
                      <option>UET Peshawar</option>
                      <option>Quaid-i-Azam University</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Owner Fields */}
              {role === 'owner' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-lg">🏠</span>
                      <input
                        type="text"
                        name="hostelName"
                        placeholder="Your hostel name"
                        value={formData.hostelName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-lg">📍</span>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select city</option>
                        <option>Lahore</option>
                        <option>Islamabad</option>
                        <option>Karachi</option>
                        <option>Peshawar</option>
                        <option>Faisalabad</option>
                        <option>Multan</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="8"
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
                {formData.password && (
                  <div className="mt-2">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 rounded mt-1 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms of Service
                  </a>{' '}
                  &{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary-700 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-70"
              >
                {isLoading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">or sign up with</span>
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
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
