import { SignUpRequest, LoginRequest, AuthResponse, User } from '../types';

export const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '') + '/api';

const TOKEN_KEY = 'google_photos_auth_token';
const USER_KEY = 'google_photos_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function signUpApi(data: SignUpRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Sign up failed. Please check input values and try again.');
  }

  setStoredSession(body.token, body.user);
  return body;
}

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Login failed. Invalid email or password.');
  }

  setStoredSession(body.token, body.user);
  return body;
}

export async function getProfileApi(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    clearStoredSession();
    throw new Error('Session expired or invalid.');
  }

  const user: User = await res.json();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}
