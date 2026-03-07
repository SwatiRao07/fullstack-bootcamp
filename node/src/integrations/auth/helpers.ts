import 'dotenv/config';

export function withAuth(options: RequestInit = {}, token: string): RequestInit {
  const headers = new Headers(options.headers as HeadersInit);
  headers.set('Authorization', `Bearer ${token}`);
  return { ...options, headers };
}

export function withApiKey(options: RequestInit = {}, apiKey?: string): RequestInit {
  const key = apiKey ?? process.env.API_KEY;
  if (!key) throw new Error('API key is required but not provided or set in .env');

  const headers = new Headers(options.headers as HeadersInit);
  headers.set('X-API-Key', key);
  return { ...options, headers };
}
