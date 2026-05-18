import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './legacy-pages/HomePage'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import BookingsPage from './pages/dashboard/BookingsPage'
import EarningsPage from './pages/dashboard/EarningsPage'
import HostelsPage from './pages/dashboard/hostels/HostelsPage'
import AddHostelPage from './pages/dashboard/hostels/AddHostelPage'
import EditHostelPage from './pages/dashboard/hostels/EditHostelPage'
import HostelDetailsPage from './pages/dashboard/hostels/HostelDetailsPage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import ReviewsPage from './pages/dashboard/ReviewsPage'
import RoomsPage from './pages/dashboard/RoomsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import TenantsPage from './pages/dashboard/TenantsPage'
import NotFoundPage from './pages/NotFoundPage'
import { DashboardShell } from '../components/dashboard/dashboard-shell'

function AuthRoute({ children }) {
  return <AuthLayout>{children}</AuthLayout>
}

function DashboardRoute({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordPage /></AuthRoute>} />
        <Route path="/dashboard" element={<DashboardRoute><DashboardPage /></DashboardRoute>} />
        <Route path="/dashboard/bookings" element={<DashboardRoute><BookingsPage /></DashboardRoute>} />
        <Route path="/dashboard/earnings" element={<DashboardRoute><EarningsPage /></DashboardRoute>} />
        <Route path="/dashboard/hostels" element={<DashboardRoute><HostelsPage /></DashboardRoute>} />
        <Route path="/dashboard/hostels/new" element={<DashboardRoute><AddHostelPage /></DashboardRoute>} />
        <Route path="/dashboard/hostels/:id" element={<DashboardRoute><HostelDetailsPage /></DashboardRoute>} />
        <Route path="/dashboard/hostels/:id/edit" element={<DashboardRoute><EditHostelPage /></DashboardRoute>} />
        <Route path="/dashboard/notifications" element={<DashboardRoute><NotificationsPage /></DashboardRoute>} />
        <Route path="/dashboard/reviews" element={<DashboardRoute><ReviewsPage /></DashboardRoute>} />
        <Route path="/dashboard/rooms" element={<DashboardRoute><RoomsPage /></DashboardRoute>} />
        <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />
        <Route path="/dashboard/tenants" element={<DashboardRoute><TenantsPage /></DashboardRoute>} />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
