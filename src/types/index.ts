// ---------------------------------------------------------------------------
// HumanGrid shared types
// ---------------------------------------------------------------------------

export type ServiceMode =
  | 'hospital'
  | 'police'
  | 'blood_bank'
  | 'shelter'
  | 'women_safety'
  | 'child_safety'
  | 'food_support'
  | 'ambulance';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ServiceCardDefinition {
  mode: ServiceMode;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
}

export interface NearbyService {
  id: string;
  name: string;
  distanceKm: number;
  availability: string; // e.g. "Open now", "12 beds free", "In stock"
  contact: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

/**
 * The single structured shape every HumanGrid AI Core response is coerced into,
 * regardless of which mode produced it. Mirrors the "AI output format" contract.
 */
export interface EmergencyAnalysis {
  problem: string;
  category: string;
  severity: Severity;
  required_services: string[];
  action_steps: string[];
  contacts: EmergencyContactSuggestion[];
  nearby_services: NearbyService[];
  mode: ServiceMode;
  // Mode-specific extras (present only when relevant)
  blood_group?: string;
  danger_level?: string;
}

export interface EmergencyContactSuggestion {
  label: string; // e.g. "National Emergency Number"
  value: string; // e.g. "112"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
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
  | 'request_accepted'
  | 'volunteer_assigned'
  | 'ambulance_dispatched'
  | 'emergency_completed';

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
  status: 'open' | 'in_progress' | 'resolved';
}
