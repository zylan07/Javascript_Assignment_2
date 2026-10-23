// All HTTP calls to the Express REST API live here
const BASE = '/api/students';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const studentApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    return request(`${BASE}?${qs}`);
  },
  departments: () => request(`${BASE}/meta/departments`),
  create: (student) => request(BASE, { method: 'POST', body: JSON.stringify(student) }),
  update: (id, student) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
