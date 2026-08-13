export type ServiceMode =
  | "hospital"
  | "police"
  | "blood_bank"
  | "shelter"
  | "women_safety"
  | "child_safety"
  | "food_support"
  | "ambulance"
  | "general_emergency";

export type Severity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type AnalysisSource =
  | "gemini"
  | "fallback";

export interface ServiceCardDefinition {
  mode: ServiceMode;
  title: string;
  description: string;
  icon: string;
}

export interface NearbyService {
  id: string;
  name: string;
  distanceKm: number;
  availability: string;
  contact: string;
  address?: string;
  lat?: number;
  lng?: number;
  dataSource?: "mock" | "verified";
}

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface EmergencyAnalysis {
  problem: string;
  category: string;
  severity: Severity;

  required_services: string[];
  action_steps: string[];
  immediate_actions?: string[];

  contacts: EmergencyContactSuggestion[];
  nearby_services: NearbyService[];
  mode: ServiceMode;

  emergency_type?: string;
  summary?: string;
  recommended_service?: ServiceMode;
  why?: string;
  warnings?: string[];
  next_steps?: string[];

  blood_group?: string;
  danger_level?: string;
  source?: AnalysisSource;
}

export interface EmergencyContactSuggestion {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  analysis?: EmergencyAnalysis;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  savedLocations: SavedLocation[];
}

export interface SavedLocation {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export type NotificationType =
  | "request_accepted"
  | "volunteer_assigned"
  | "ambulance_dispatched"
  | "emergency_completed";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface RequestHistoryItem {
  id: string;
  mode: ServiceMode;
  problem: string;
  severity: Severity;
  createdAt: string;
  status: "open" | "in_progress" | "resolved";
}