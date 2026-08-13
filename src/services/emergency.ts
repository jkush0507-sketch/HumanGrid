import type {
  Coordinates,
  EmergencyContactSuggestion,
  NearbyService,
  ServiceCardDefinition,
  ServiceMode,
} from "@/types";
import { distanceKm } from "./location";

export const SERVICE_CARDS: ServiceCardDefinition[] = [
  { mode: "hospital", title: "Hospital Assistance", description: "Medical emergencies, injuries, and urgent care guidance.", icon: "Cross" },
  { mode: "blood_bank", title: "Blood Bank", description: "Blood-group and blood-support guidance.", icon: "Droplet" },
  { mode: "police", title: "Police Help", description: "Crime, security, threat, and incident guidance.", icon: "Shield" },
  { mode: "ambulance", title: "Ambulance", description: "Urgent medical transport and escalation guidance.", icon: "Siren" },
  { mode: "women_safety", title: "Women Safety", description: "Immediate personal-safety guidance and escalation.", icon: "ShieldAlert" },
  { mode: "child_safety", title: "Child Safety", description: "Support for missing or endangered children.", icon: "HeartHandshake" },
  { mode: "food_support", title: "Food Support", description: "Food and community-support guidance.", icon: "Soup" },
  { mode: "shelter", title: "Shelter Support", description: "Safe shelter and relief-support guidance.", icon: "Home" },
  { mode: "general_emergency", title: "General Emergency", description: "Guidance for an emergency without a clear category.", icon: "AlertTriangle" },
];

export function getServiceCard(mode: ServiceMode): ServiceCardDefinition {
  const card = SERVICE_CARDS.find((serviceCard) => serviceCard.mode === mode);
  if (!card) throw new Error(`Unknown service mode: ${mode}`);
  return card;
}

export function getContactsForMode(mode: ServiceMode): EmergencyContactSuggestion[] {
  const universal: EmergencyContactSuggestion[] = [{ label: "National Emergency Number", value: "112" }];
  const byMode: Partial<Record<ServiceMode, EmergencyContactSuggestion[]>> = {
    hospital: [{ label: "Ambulance", value: "108" }],
    ambulance: [{ label: "Ambulance", value: "108" }],
    police: [{ label: "Police", value: "100" }],
    women_safety: [{ label: "Women Helpline", value: "1091" }],
    child_safety: [{ label: "Child Helpline", value: "1098" }],
    blood_bank: [{ label: "Blood Bank Helpline", value: "104" }],
  };
  return [...universal, ...(byMode[mode] ?? [])];
}

export async function getNearbyServices(mode: ServiceMode, origin: Coordinates): Promise<NearbyService[]> {
  const templates = NEARBY_TEMPLATES[mode] ?? NEARBY_TEMPLATES.general_emergency;
  const services = templates.map((template, index) => {
    const angle = (index / templates.length) * 2 * Math.PI;
    const radiusDegrees = 0.01 + index * 0.006;
    const point: Coordinates = {
      lat: origin.lat + radiusDegrees * Math.cos(angle),
      lng: origin.lng + radiusDegrees * Math.sin(angle),
    };
    return {
      ...template,
      id: `${mode}-mock-${index}`,
      lat: point.lat,
      lng: point.lng,
      distanceKm: Math.round(distanceKm(origin, point) * 10) / 10,
      dataSource: "mock" as const,
    };
  });
  return services.sort((first, second) => first.distanceKm - second.distanceKm);
}

type NearbyTemplate = Omit<NearbyService, "id" | "lat" | "lng" | "distanceKm" | "dataSource">;

const NEARBY_TEMPLATES: Record<ServiceMode, NearbyTemplate[]> = {
  hospital: [{ name: "Demo hospital result", availability: "Verify availability before traveling", contact: "112" }, { name: "Demo medical center result", availability: "Verify availability before traveling", contact: "112" }],
  blood_bank: [{ name: "Demo blood-bank result", availability: "Verify stock before traveling", contact: "104" }, { name: "Demo blood-center result", availability: "Verify stock before traveling", contact: "104" }],
  police: [{ name: "Demo police-service result", availability: "Verify location before traveling", contact: "100" }, { name: "Demo police-support result", availability: "Verify location before traveling", contact: "100" }],
  ambulance: [{ name: "Demo ambulance result", availability: "Call emergency services directly", contact: "108" }, { name: "Demo medical transport result", availability: "Call emergency services directly", contact: "108" }],
  women_safety: [{ name: "Demo women-safety result", availability: "Verify location before traveling", contact: "1091" }, { name: "Demo police-support result", availability: "Verify location before traveling", contact: "100" }],
  child_safety: [{ name: "Demo child-safety result", availability: "Contact authorities immediately", contact: "1098" }, { name: "Demo police-support result", availability: "Contact authorities immediately", contact: "100" }],
  food_support: [{ name: "Demo community-food result", availability: "Verify operating hours", contact: "112" }, { name: "Demo food-support result", availability: "Verify availability", contact: "112" }],
  shelter: [{ name: "Demo shelter result", availability: "Verify space before traveling", contact: "112" }, { name: "Demo relief-center result", availability: "Verify space before traveling", contact: "112" }],
  general_emergency: [{ name: "General emergency support", availability: "Call 112 for immediate danger", contact: "112" }, { name: "Local emergency assistance", availability: "Verify provider details", contact: "112" }],
};