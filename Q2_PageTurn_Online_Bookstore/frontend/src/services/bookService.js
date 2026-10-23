const API = '/api/books';

async function call(path = '', method = 'GET', body) {
  const res = await fetch(API + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Something went wrong');
  return json;
}

export const getBooks = (params) => call('?' + new URLSearchParams(params).toString());
export const getSummary = () => call('/meta/summary');
export const addBook = (book) => call('', 'POST', book);
export const updateBook = (id, book) => call(`/${id}`, 'PUT', book);
export const toggleAvailability = (id) => call(`/${id}/availability`, 'PATCH');
export const deleteBook = (id) => call(`/${id}`, 'DELETE');
