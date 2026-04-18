export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk';

export interface IncidentDetail {
  id: string;
  lat: string;
  lng: string;
  categories: string;
  description: string;
  incident_date: string;
}

export interface RouteInfo {
  route_name: string;
  safety_score: number;
  incident_count: number;
  risk_level: RiskLevel;
  bounds_analyzed: number;
  incident_ids: number[];
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'Hospital' | 'Police' | 'Safe Place';
  latitude: number;
  longitude: number;
}

export interface RouteSafetyResponse {
  routes: RouteInfo[];
  safest_route: string;
  incidents: IncidentDetail[];
  safe_zones: SafeZone[];
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  trustedContacts: TrustedContact[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}
