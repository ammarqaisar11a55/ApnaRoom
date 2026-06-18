const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const NORMALIZED_API_URL = RAW_API_URL.replace(/\/+$/, '')
const API_URL = NORMALIZED_API_URL.endsWith('/api')
  ? NORMALIZED_API_URL
  : `${NORMALIZED_API_URL}/api`

export function apiUrl(path) {
  return `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
