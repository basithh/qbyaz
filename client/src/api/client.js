const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Something went wrong')
  }
  return res.json()
}

export const api = {
  createSession: (data) =>
    request('/sessions', { method: 'POST', body: JSON.stringify(data) }),

  getSession: (slug) =>
    request(`/sessions/${slug}`),

  closeSession: (slug) =>
    request(`/sessions/${slug}/close`, { method: 'POST' }),

  getQrUrl: (slug) =>
    `${BASE}/sessions/${slug}/qr`,

  createToken: (slug, data) =>
    request(`/sessions/${slug}/tokens`, { method: 'POST', body: JSON.stringify(data) }),

  getTokens: (slug, status) => {
    const params = status ? `?status=${status}` : ''
    return request(`/sessions/${slug}/tokens${params}`)
  },

  getQueueState: (slug) =>
    request(`/sessions/${slug}/queue`),

  updateTokenStatus: (id, status) =>
    request(`/tokens/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  callNext: (slug) =>
    request(`/sessions/${slug}/next`, { method: 'POST' }),

  getEventsUrl: (slug) =>
    `${BASE}/sessions/${slug}/events`,
}
