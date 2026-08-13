import type {
  Coordinates,
  EmergencyContactSuggestion,
  NearbyService,
  ServiceCardDefinition,
  ServiceMode,
} from '../types';
import { distanceKm } from './location';

export const SERVICE_CARDS: ServiceCardDefinition[] = [
  {
    mode: 'hospital',
    title: 'Hospital Assistance',
    description: 'Medical emergencies, injuries, and urgent care triage.',
    icon: 'Cross',
  },
  {
    mode: 'blood_bank',
    title: 'Blood Bank',
    description: 'Locate blood banks and request a specific blood group fast.',
    icon: 'Droplet',
  },
  {
    mode: 'police',
    title: 'Police Help',
    description: 'Report crimes, theft, or request law enforcement support.',
    icon: 'Shield',
  },
  {
    mode: 'ambulance',
    title: 'Ambulance',
    description: 'Dispatch the nearest available ambulance to your location.',
    icon: 'Siren',
  },
  {
    mode: 'women_safety',
    title: 'Women Safety',
    description: 'Immediate safety support, trusted contacts, and SOS routing.',
    icon: 'ShieldAlert',
  },
  {
    mode: 'child_safety',
    title: 'Child Safety',
    description: 'Missing child alerts and coordinated emergency response.',
    icon: 'HeartHandshake',
  },
  {
    mode: 'food_support',
    title: 'Food Support',
    description: 'Community kitchens, NGOs, and food relief near you.',
    icon: 'Soup',
  },
  {
    mode: 'shelter',
    title: 'Shelter Support',
    description: 'Find temporary shelter and safe housing options nearby.',
    icon: 'Home',
  },
];

export function getServiceCard(mode: ServiceMode): ServiceCardDefinition {
  const card = SERVICE_CARDS.find((c) => c.mode === mode);
  if (!card) throw new Error(`Unknown service mode: ${mode}`);
  return card;
}

/** Universal + mode-specific quick-dial contacts (India defaults, override per deployment). */
export function getContactsForMode(mode: ServiceMode): EmergencyContactSuggestion[] {
  const universal: EmergencyContactSuggestion[] = [
    { label: 'National Emergency Number', value: '112' },
  ];

  const byMode: Partial<Record<ServiceMode, EmergencyContactSuggestion[]>> = {
    hospital: [{ label: 'Ambulance', value: '108' }],
    ambulance: [{ label: 'Ambulance', value: '108' }],
    police: [{ label: 'Police', value: '100' }],
    women_safety: [{ label: 'Women Helpline', value: '1091' }],
    child_safety: [{ label: 'Child Helpline', value: '1098' }],
    blood_bank: [{ label: 'Blood Bank Helpline', value: '104' }],
  };

  return [...universal, ...(byMode[mode] ?? [])];
}

/**
 * Returns nearby resources for the given mode and origin.
 *
 * NOTE: This is a deterministic mock generator so the UI is fully functional
 * out of the box. In production, replace the body of this function with a
 * Supabase query (e.g. a `facilities` table with PostGIS distance ordering)
 * or a Google Places / Overpass API call, keeping the same return shape.
 */
export async function getNearbyServices(
  mode: ServiceMode,
  origin: Coordinates
): Promise<NearbyService[]> {
  const templates = NEARBY_TEMPLATES[mode] ?? NEARBY_TEMPLATES.hospital;

  const services = templates.map((t, index) => {
    // Spread mock points deterministically around the origin so distances feel real.
    const angle = (index / templates.length) * 2 * Math.PI;
    const radiusDeg = 0.01 + index * 0.006;
    const point: Coordinates = {
      lat: origin.lat + radiusDeg * Math.cos(angle),
      lng: origin.lng + radiusDeg * Math.sin(angle),
    };
    return {
      ...t,
      id: `${mode}-${index}`,
      lat: point.lat,
      lng: point.lng,
      distanceKm: Math.round(distanceKm(origin, point) * 10) / 10,
    } satisfies NearbyService;
  });

  return services.sort((a, b) => a.distanceKm - b.distanceKm);
}

type NearbyTemplate = Omit<NearbyService, 'id' | 'lat' | 'lng' | 'distanceKm'>;

const NEARBY_TEMPLATES: Record<ServiceMode, NearbyTemplate[]> = {
  hospital: [
    { name: 'City General Hospital', availability: 'ER open · 24/7', contact: '+91 100 200 3001' },
    { name: 'St. Mary\u2019s Medical Center', availability: '6 ICU beds free', contact: '+91 100 200 3002' },
    { name: 'Sunrise Multispecialty Hospital', availability: 'ER open · 24/7', contact: '+91 100 200 3003' },
  ],
  blood_bank: [
    { name: 'Red Cross Blood Bank', availability: 'In stock', contact: '+91 100 200 4001' },
    { name: 'LifeLine Blood Center', availability: 'Low stock \u2014 call ahead', contact: '+91 100 200 4002' },
    { name: 'City Hospital Blood Bank', availability: 'In stock', contact: '+91 100 200 4003' },
  ],
  police: [
    { name: 'Central Police Station', availability: 'Open · 24/7', contact: '100' },
    { name: 'North District Police Outpost', availability: 'Open · 24/7', contact: '+91 100 200 5002' },
    { name: 'Community Police Cell', availability: 'Open until 10 PM', contact: '+91 100 200 5003' },
  ],
  ambulance: [
    { name: 'HumanGrid Rapid Response Unit', availability: 'Available now', contact: '108' },
    { name: 'City Ambulance Service', availability: 'Available now', contact: '+91 100 200 6002' },
    { name: 'Private Paramedic Unit', availability: '4 min ETA', contact: '+91 100 200 6003' },
  ],
  women_safety: [
    { name: 'Central Police Station', availability: 'Open · 24/7', contact: '100' },
    { name: 'Women Safety Cell', availability: 'Open · 24/7', contact: '1091' },
    { name: 'North District Police Outpost', availability: 'Open · 24/7', contact: '+91 100 200 5002' },
  ],
  child_safety: [
    { name: 'Central Police Station', availability: 'Open · 24/7', contact: '100' },
    { name: 'Child Welfare Committee Office', availability: 'Open · 24/7', contact: '1098' },
    { name: 'North District Police Outpost', availability: 'Open · 24/7', contact: '+91 100 200 5002' },
  ],
  food_support: [
    { name: 'Community Kitchen \u2014 Central', availability: 'Serving now', contact: '+91 100 200 7001' },
    { name: 'Helping Hands NGO', availability: 'Open until 8 PM', contact: '+91 100 200 7002' },
    { name: 'Shelter Home Meal Program', availability: 'Serving now', contact: '+91 100 200 7003' },
  ],
  shelter: [
    { name: 'City Emergency Shelter', availability: '14 beds free', contact: '+91 100 200 8001' },
    { name: 'Hope Foundation Shelter Home', availability: '5 beds free', contact: '+91 100 200 8002' },
    { name: 'Community Relief Center', availability: '20 beds free', contact: '+91 100 200 8003' },
  ],
};
