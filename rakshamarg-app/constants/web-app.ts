const fallbackBaseUrl = 'https://www.rakshamarg.app';

export const WEB_APP_BASE_URL = (process.env.EXPO_PUBLIC_WEB_APP_URL || fallbackBaseUrl)
  .trim()
  .replace(/\/$/, '');

export const WEB_APP_API_KEY = (process.env.EXPO_PUBLIC_API_KEY || '').trim();

export function getWebAppUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${WEB_APP_BASE_URL}${normalizedPath}`;
}
