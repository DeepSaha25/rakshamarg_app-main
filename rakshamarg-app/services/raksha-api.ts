import axios from 'axios';

import {
  ChatMessage,
  RouteSafetyResponse,
  TrustedContact,
  UserProfile,
} from '@/types/raksha';

const DEFAULT_REMOTE_API_BASE_URL = 'https://rakshamarg-backend.onrender.com';
const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? '';
const FIREBASE_ID_TOKEN = process.env.EXPO_PUBLIC_FIREBASE_ID_TOKEN ?? '';

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/$/, '');
}

function resolveApiBaseUrl(): string {
  const envUrl = normalizeBaseUrl(ENV_API_BASE_URL);

  if (!envUrl) {
    console.warn(
      `[API] EXPO_PUBLIC_API_BASE_URL is not set. Falling back to deployed backend: ${DEFAULT_REMOTE_API_BASE_URL}`
    );
    return DEFAULT_REMOTE_API_BASE_URL;
  }

  if (/localhost|127\.0\.0\.1/.test(envUrl)) {
    console.warn(
      '[API] EXPO_PUBLIC_API_BASE_URL points to localhost/127.0.0.1. This will fail on Expo Go physical devices. Use your machine LAN IP, for example: http://192.168.1.20:8000'
    );
  }

  return envUrl;
}

const API_BASE_URL = resolveApiBaseUrl();

console.log(`[API] Using base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  config.headers = {
    ...(config.headers ?? {}),
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    config.headers['x-api-key'] = API_KEY;
  }

  if (FIREBASE_ID_TOKEN) {
    config.headers.Authorization = `Bearer ${FIREBASE_ID_TOKEN}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
      const url = error.config?.url ?? 'UNKNOWN_URL';
      const baseUrl = error.config?.baseURL ?? API_BASE_URL;
      const fullUrl = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

      console.error('[API] Request failed', {
        message: error.message,
        code: error.code,
        method,
        url,
        fullUrl,
        baseUrl,
        status,
        responseData,
      });

      if (!error.response) {
        console.error(
          '[API] Network failure detected. Verify backend is running on 0.0.0.0, API URL uses LAN IP, phone and laptop are on same Wi-Fi, and Expo tunnel mode is enabled if LAN routing is blocked.'
        );
      }
    } else {
      console.error('[API] Unknown request error', error);
    }

    return Promise.reject(error);
  }
);

export async function analyzeRouteSafety(origin: string, destination: string): Promise<RouteSafetyResponse> {
  const response = await api.post('/api/v1/navigation/safety', {
    origin,
    destination,
  });

  const data = response.data as Partial<RouteSafetyResponse>;

  return {
    routes: data.routes ?? [],
    safest_route: data.safest_route ?? 'Safest Route',
    incidents: data.incidents ?? [],
    safe_zones: data.safe_zones ?? [],
  };
}

export async function triggerSos(latitude?: number, longitude?: number): Promise<string> {
  const response = await api.post('/api/v1/navigation/sos', {
    latitude,
    longitude,
    triggeredAt: new Date().toISOString(),
  });
  return response.data?.status ?? 'SOS Triggered';
}

export async function sendLocationTrack(latitude: number, longitude: number): Promise<void> {
  await api.post('/api/v1/navigation/track', {
    currentLat: latitude,
    currentLng: longitude,
    timestamp: new Date().toISOString(),
  });
}

export async function sendAssistantMessage(
  message: string,
  conversationHistory: ChatMessage[],
  journeySummary: string
): Promise<ChatMessage> {
  const response = await api.post('/api/v1/navigation/chat', {
    message,
    conversationHistory,
    journeyContext: journeySummary,
  });

  return {
    id: `${Date.now()}-assistant`,
    role: 'assistant',
    content: response.data?.response ?? 'I am here to help keep you safe.',
    timestamp: new Date().toISOString(),
    isEmergency: Boolean(response.data?.isEmergency),
  };
}

export async function fetchProfile(): Promise<UserProfile> {
  const response = await api.get('/api/v1/users/me');
  const user = response.data?.user;

  return {
    id: user?.id ?? 'local-user',
    displayName: user?.displayName ?? null,
    email: user?.email ?? null,
    phoneNumber: user?.phoneNumber ?? null,
    trustedContacts: (user?.trustedContacts ?? []) as TrustedContact[],
    updatedAt: new Date().toISOString(),
  };
}

export async function syncTrustedContacts(contacts: TrustedContact[]): Promise<TrustedContact[]> {
  const response = await api.put('/api/v1/users/me/trusted-contacts', { contacts });
  return (response.data?.contacts ?? contacts) as TrustedContact[];
}
