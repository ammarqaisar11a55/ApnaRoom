"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/providers";
import {
  BedDouble,
  Bell,
  Building2,
  CreditCard,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  Plus,
  Settings,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard Overview", icon: Home },
  { href: "/dashboard/hostels", label: "My Hostels", icon: Building2 },
  { href: "/dashboard/hostels/new", label: "Add Hostel", icon: Plus },
  { href: "/dashboard/rooms", label: "Room Management", icon: BedDouble },
  { href: "/dashboard/bookings", label: "Bookings", icon: MessageSquareText },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users },
  { href: "/dashboard/earnings", label: "Earnings", icon: CreditCard },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, token, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-primary-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
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
        <div>
          <p className="font-display text-lg font-black tracking-normal text-primary-800 dark:text-white">
            Apna<span className="text-blue-500">Room</span>
          </p>
          <p className="text-xs text-slate-500">Owner console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                active
                  ? "bg-primary-50 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  : "text-slate-600 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-error-50 hover:text-error-700 dark:text-slate-400 dark:hover:bg-error-950/40 dark:hover:text-error-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 cursor-pointer bg-slate-950/50" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary-100 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="font-display text-sm font-bold text-primary-800 dark:text-white">Owner Dashboard</p>
              <p className="hidden text-xs text-slate-500 sm:block">{user?.hostelName || "Manage listings, rooms, bookings, and tenants"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
            <Button variant="outline" size="icon" className="relative" aria-label="Notifications" asChild>
              <Link to="/dashboard/notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500" />
              </Link>
            </Button>
            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-800 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                {user?.name?.slice(0, 2).toUpperCase() || "AR"}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{user?.name || "Owner"}</p>
                <p className="text-xs text-slate-500">{user?.email || "owner@apnaroom.com"}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-800 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
