import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/assets'

export function BrandMark({ dark = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="url(#auth-logo-gradient)" />
        <path d="M20 8 8 18h4v12h6v-7h4v7h6V18h4L20 8Z" fill="white" />
        <defs>
          <linearGradient id="auth-logo-gradient" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="rgb(37, 99, 235)" />
            <stop offset="1" stopColor="rgb(30, 58, 95)" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`text-2xl font-black font-display ${dark ? 'text-white' : 'text-primary-700'}`}>
        Apna<span className={dark ? 'text-primary-200' : 'text-primary-500'}>Room</span>
      </span>
    </Link>
  )
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  const highlights = [
    'Verified accommodation partners',
    'Student and owner dashboards',
    'Built for safe, reliable bookings',
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-primary-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <img
              src={assetUrl('assets/herosectionrightpic.jpg')}
              alt="Modern hostel building"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-800/88 to-primary-600/70"></div>
          </div>

          <div className="relative z-10">
            <BrandMark dark />
          </div>

          <div className="relative z-10 max-w-xl space-y-8">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur">
              International-ready student housing platform
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight font-display">
                Where better stays begin with trust.
              </h2>
              <p className="text-lg leading-8 text-blue-50">
                A refined booking experience for students, families, and hostel partners across growing university markets.
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <CheckIcon />
                  </span>
                  <span className="font-semibold text-white">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-xs text-blue-100">Hostels</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs text-blue-100">Cities</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-2xl font-bold">12k+</div>
              <div className="text-xs text-blue-100">Students</div>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <BrandMark />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
              <div className="mb-8 space-y-3">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {eyebrow}
                </span>
                <div>
                  <h1 className="text-3xl font-bold text-primary-800 font-display sm:text-4xl">{title}</h1>
                  <p className="mt-2 leading-7 text-slate-600">{subtitle}</p>
                </div>
              </div>

              {children}
            </div>

            {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
          </div>
        </section>
      </div>
    </main>
  )
}
