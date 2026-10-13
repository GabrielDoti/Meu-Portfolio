export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const hasApi = Boolean(API_URL)

const DEFAULT_TIMEOUT = 75_000

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.erro || `Erro ${status}`)
    this.status = status
    this.data = data
  }
}

async function request(path, { method = 'GET', body, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new ApiError(res.status, data)
    return data
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  health: () => request('/api/health'),
  news: () => request('/api/novidades'),
  visits: () => request('/api/visitas'),
  registerVisit: () => request('/api/visitas', { method: 'POST' }),
  sendContact: (form) => request('/api/contato', { method: 'POST', body: form }),
}
