import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import { apiUrl } from '../../config/api'
import { useAuthStore } from '@/store/auth-store'

function Icon({ type }) {
  const paths = {
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    email: 'M4 6h16v12H4V6Zm0 1 8 6 8-6',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z',
    school: 'M22 10 12 5 2 10l10 5 10-5ZM6 12.5V17c2.2 2 9.8 2 12 0v-4.5',
    building: 'M4 21h16M6 21V5h9v16M15 9h3v12M9 9h3M9 13h3M9 17h3',
    city: 'M3 21h18M5 21V7h6v14M13 21V3h6v18M7 11h2M7 15h2M15 7h2M15 11h2M15 15h2',
    lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z',
    eye: 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  }

  return (
    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RoleButton({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all ${
        active
          ? 'bg-white text-primary-800 shadow-sm ring-1 ring-slate-200'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      <Icon type={icon} />
      {label}
    </button>
  )
}

function Field({ id, label, icon, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <Icon type={icon} />
        </span>
        {children}
      </div>
    </div>
  )
}

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

  const inputClass =
    'min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100'

  const selectClass = `${inputClass} appearance-none`

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1
    return strength
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      }

      if (role === 'student') {
        payload.university = formData.university
      } else {
        payload.hostelName = formData.hostelName
        payload.city = formData.city
      }

      const response = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        useAuthStore.getState().setSession(data.token, data.user)
        navigate(data.user.role === 'student' ? '/hostels' : '/dashboard')
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
    if (passwordStrength === 2) return 'bg-amber-500'
    if (passwordStrength === 3) return 'bg-blue-500'
    return 'bg-emerald-500'
  }

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Start with ApnaRoom"
      subtitle="Join as a student searching for a better stay, or as a hostel partner ready to grow."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-700 transition-colors hover:text-primary-700">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
        <RoleButton active={role === 'student'} icon="user" label="Student" onClick={() => setRole('student')} />
        <RoleButton active={role === 'owner'} icon="building" label="Hostel owner" onClick={() => setRole('owner')} />
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="name" label="Full name" icon="user">
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email address" icon="email">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </Field>

        <Field id="phone" label="Phone number" icon="phone">
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+92 3XX XXXXXXX"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </Field>

        {role === 'student' ? (
          <Field id="university" label="University" icon="school">
            <select
              id="university"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className={selectClass}
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
          </Field>
        ) : (
          <>
            <Field id="hostelName" label="Hostel name" icon="building">
              <input
                id="hostelName"
                type="text"
                name="hostelName"
                placeholder="Your hostel name"
                value={formData.hostelName}
                onChange={handleInputChange}
                className={inputClass}
              />
            </Field>

            <Field id="city" label="City" icon="city">
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={selectClass}
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
            </Field>
          </>
        )}

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Icon type="lock" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 transition hover:bg-slate-100"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon type="eye" />
            </button>
          </div>
          {formData.password && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
          />
          <span className="text-sm leading-6 text-slate-600">
            I agree to the{' '}
            <a href="#" className="font-semibold text-blue-700 hover:text-primary-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-blue-700 hover:text-primary-700">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 w-full rounded-xl bg-gradient-to-r from-primary-700 to-blue-500 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
