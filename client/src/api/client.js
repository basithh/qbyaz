const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('qbyaz_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Something went wrong')
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Sessions
  createSession: (data) =>
    request('/sessions', { method: 'POST', body: JSON.stringify(data) }),

  getSession: (slug) =>
    request(`/sessions/${slug}`),

  closeSession: (slug) =>
    request(`/sessions/${slug}/close`, { method: 'POST' }),

  getQrUrl: (slug) =>
    `${BASE}/sessions/${slug}/qr`,

  // Tokens
  createToken: (slug, data) =>
    request(`/sessions/${slug}/tokens`, { method: 'POST', body: JSON.stringify(data) }),

  getTokens: (slug, status) => {
    const params = status ? `?status=${status}` : ''
    return request(`/sessions/${slug}/tokens${params}`)
  },

  // Queue
  getQueueState: (slug) =>
    request(`/sessions/${slug}/queue`),

  updateTokenStatus: (id, status) =>
    request(`/tokens/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  callNext: (slug) =>
    request(`/sessions/${slug}/next`, { method: 'POST' }),

  getEventsUrl: (slug) =>
    `${BASE}/sessions/${slug}/events`,
}
