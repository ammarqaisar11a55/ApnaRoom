import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import { apiUrl } from '../../config/api'
import { useAuthStore } from '@/store/auth-store'

function Icon({ type }) {
  const paths = {
    email: 'M4 6h16v12H4V6Zm0 1 8 6 8-6',
    lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z',
    eye: 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z',
  }

  return (
    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [role] = useState('student')
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
      const response = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, role }),
      })
      const data = await response.json()

      if (response.ok) {
        useAuthStore.getState().setSession(data.token, data.user)
        navigate(data.user.role === 'student' ? '/hostels' : '/dashboard')
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
    <AuthShell
      eyebrow="Secure sign in"
      title="Welcome back"
      subtitle="Access bookings, saved rooms, and partner tools from one secure workspace."
      footer={
        <>
          New to ApnaRoom?{' '}
          <Link to="/signup" className="font-semibold text-primary-700 transition-colors hover:text-primary-700">
            Create an account
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Icon type="email" />
            </span>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            />
          </div>
        </div>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
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
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-slate-300 accent-primary-600"
            />
            Remember me
          </label>
          <a href="#" className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200"></div>
        <span className="text-sm text-slate-500">or continue with</span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="text-primary-600">G</span>
          Google
        </button>
        <button
          type="button"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Icon type="phone" />
          Phone
        </button>
      </div>
    </AuthShell>
  )
}
