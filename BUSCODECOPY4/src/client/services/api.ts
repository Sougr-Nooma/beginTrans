const API_BASE = '/api/auth';

async function handleResponse(response: Response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error || 'Erreur de connexion au serveur');
  }
  return body;
}

export async function registerClient(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/register-client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginClient(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/login-client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function registerCompany(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  description?: string;
  address?: string;
}) {
  const res = await fetch(`${API_BASE}/register-company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginCompany(data: { id: string; password: string }) {
  const res = await fetch(`${API_BASE}/login-company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
