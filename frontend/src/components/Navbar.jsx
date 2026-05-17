import { useState } from 'react'
import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Cities', href: '#cities' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why ApnaRoom', href: '#features' },
  { label: 'Reviews', href: '#testimonials' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ApnaRoom home">
      <svg className="h-9 w-9 shrink-0" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="url(#logoGrad)" />
        <path d="M20 8 8 18h4v12h6v-7h4v7h6V18h4L20 8Z" fill="white" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#1e3a5f" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-black tracking-normal text-primary-800 font-display">
        Apna<span className="text-blue-500">Room</span>
      </span>
    </Link>
  )
}

export default function Navbar({ scrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl'
            : 'border-white/70 bg-white/80 shadow-sm backdrop-blur-xl'
        }`}
      >
        <div className="flex min-h-16 items-center justify-between px-4 sm:px-5">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-800"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary-800"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-primary-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
              <span className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 px-4 pb-4 pt-2 md:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary-800"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl bg-primary-800 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
