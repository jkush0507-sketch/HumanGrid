export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type ServiceMode =
  | "hospital"
  | "blood_bank"
  | "police"
  | "ambulance"
  | "women_safety"
  | "child_safety"
  | "food_support"
  | "shelter"
  | "general_emergency";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface EmergencyContactSuggestion {
  label: string;
  value: string;
}

export interface NearbyService {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  availability: string;
  contact: string;
  dataSource: "mock" | "live";
}

export interface EmergencyAnalysis {
  problem: string;
  category: string;
  severity: Severity;
  required_services: string[];
  action_steps: string[];
  immediate_actions: string[];
  contacts: EmergencyContactSuggestion[];
  nearby_services: NearbyService[];
  mode: ServiceMode;
  emergency_type: string;
  summary: string;
  recommended_service: ServiceMode;
  why: string;
  warnings: string[];
  next_steps: string[];
  blood_group?: string;
  danger_level?: string;
  source: "gemini" | "fallback";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  analysis?: EmergencyAnalysis;
  createdAt: string;
}

export interface ServiceCardDefinition {
  mode: ServiceMode;
  title: string;
  description: string;
  icon: string;
}