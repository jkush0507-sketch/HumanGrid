import type {
  Coordinates,
  EmergencyContactSuggestion,
  NearbyService,
  ServiceCardDefinition,
  ServiceMode,
} from "@/types";
import { distanceKm } from "./location";

export const SERVICE_CARDS: ServiceCardDefinition[] = [
  {
    mode: "hospital",
    title: "Hospital Assistance",
    description: "Medical emergencies, injuries, and urgent care triage.",
    icon: "Cross",
  },
  {
    mode: "blood_bank",
    title: "Blood Bank",
    description: "Locate blood banks and request a specific blood group fast.",
    icon: "Droplet",
  },
  {
    mode: "police",
    title: "Police Help",
    description: "Report crimes, theft, or request law-enforcement support.",
    icon: "Shield",
  },
  {
    mode: "ambulance",
    title: "Ambulance",
    description: "Prioritize urgent medical transport and escalation.",
    icon: "Siren",
  },
  {
    mode: "women_safety",
    title: "Women Safety",
    description: "Immediate safety support, trusted contacts, and escalation.",
    icon: "ShieldAlert",
  },
  {
    mode: "child_safety",
    title: "Child Safety",
    description: "Support for a missing or endangered child.",
    icon: "HeartHandshake",
  },
  {
    mode: "food_support",
    title: "Food Support",
    description: "Community kitchens, NGOs, and food relief near you.",
    icon: "Soup",
  },
  {
    mode: "shelter",
    title: "Shelter Support",
    description: "Find temporary shelter and safe housing options nearby.",
    icon: "Home",
  },
  {
    mode: "general_emergency",
    title: "General Emergency",
    description: "Guidance for an emergency that does not fit another category.",
    icon: "AlertTriangle",
  },
];

export function getServiceCard(mode: ServiceMode): ServiceCardDefinition {
  const card = SERVICE_CARDS.find((serviceCard) => serviceCard.mode === mode);

  if (!card) {
    throw new Error(`Unknown service mode: ${mode}`);
  }

  return card;
}

/**
 * Returns emergency contact suggestions for the selected mode.
 *
 * These are deployment defaults for India and should be verified for the
 * actual deployment region before production release.
 */
export function getContactsForMode(
  mode: ServiceMode
): EmergencyContactSuggestion[] {
  const universal: EmergencyContactSuggestion[] = [
    {
      label: "National Emergency Number",
      value: "112",
    },
  ];

  const byMode: Partial<
    Record<ServiceMode, EmergencyContactSuggestion[]>
  > = {
    hospital: [
      {
        label: "Ambulance",
        value: "108",
      },
    ],
    ambulance: [
      {
        label: "Ambulance",
        value: "108",
      },
    ],
    police: [
      {
        label: "Police",
        value: "100",
      },
    ],
    women_safety: [
      {
        label: "Women Helpline",
        value: "1091",
      },
    ],
    child_safety: [
      {
        label: "Child Helpline",
        value: "1098",
      },
    ],
    blood_bank: [
      {
        label: "Blood Bank Helpline",
        value: "104",
      },
    ],
  };

  return [...universal, ...(byMode[mode] ?? [])];
}

/**
 * Current implementation returns deterministic mock resources around the
 * user's location. These are not verified live providers.
 *
 * Replace this function later with a Supabase facilities query or verified
 * maps/provider API while keeping the same NearbyService return shape.
 */
export async function getNearbyServices(
  mode: ServiceMode,
  origin: Coordinates
): Promise<NearbyService[]> {
  const templates =
    NEARBY_TEMPLATES[mode] ?? NEARBY_TEMPLATES.general_emergency;

  const services = templates.map((template, index) => {
    const angle = (index / templates.length) * 2 * Math.PI;
    const radiusDeg = 0.01 + index * 0.006;

    const point: Coordinates = {
      lat: origin.lat + radiusDeg * Math.cos(angle),
      lng: origin.lng + radiusDeg * Math.sin(angle),
    };

    return {
      ...template,
      id: `${mode}-mock-${index}`,
      lat: point.lat,
      lng: point.lng,
      distanceKm: Math.round(distanceKm(origin, point) * 10) / 10,
      dataSource: "mock",
    } satisfies NearbyService;
  });

  return services.sort((first, second) => {
    return first.distanceKm - second.distanceKm;
  });
}

type NearbyTemplate = Omit<
  NearbyService,
  "id" | "lat" | "lng" | "distanceKm" | "dataSource"
>;

const NEARBY_TEMPLATES: Record<ServiceMode, NearbyTemplate[]> = {
  hospital: [
    {
      name: "Demo hospital result",
      availability: "Verify availability before traveling",
      contact: "112",
    },
    {
      name: "Demo medical center result",
      availability: "Verify availability before traveling",
      contact: "112",
    },
  ],

  blood_bank: [
    {
      name: "Demo blood-bank result",
      availability: "Verify stock before traveling",
      contact: "104",
    },
    {
      name: "Demo blood-center result",
      availability: "Verify stock before traveling",
      contact: "104",
    },
  ],

  police: [
    {
      name: "Demo police-service result",
      availability: "Verify location before traveling",
      contact: "100",
    },
    {
      name: "Demo police-support result",
      availability: "Verify location before traveling",
      contact: "100",
    },
  ],

  ambulance: [
    {
      name: "Demo ambulance result",
      availability: "Call emergency services directly",
      contact: "108",
    },
    {
      name: "Demo medical transport result",
      availability: "Call emergency services directly",
      contact: "108",
    },
  ],

  women_safety: [
    {
      name: "Demo women-safety result",
      availability: "Verify location before traveling",
      contact: "1091",
    },
    {
      name: "Demo police-support result",
      availability: "Verify location before traveling",
      contact: "100",
    },
  ],

  child_safety: [
    {
      name: "Demo child-safety result",
      availability: "Contact authorities immediately",
      contact: "1098",
    },
    {
      name: "Demo police-support result",
      availability: "Contact authorities immediately",
      contact: "100",
    },
  ],

  food_support: [
    {
      name: "Demo community-food result",
      availability: "Verify operating hours",
      contact: "112",
    },
    {
      name: "Demo food-support result",
      availability: "Verify availability",
      contact: "112",
    },
  ],

  shelter: [
    {
      name: "Demo shelter result",
      availability: "Verify space before traveling",
      contact: "112",
    },
    {
      name: "Demo relief-center result",
      availability: "Verify space before traveling",
      contact: "112",
    },
  ],

  general_emergency: [
    {
      name: "General emergency support",
      availability: "Call 112 for immediate danger",
      contact: "112",
    },
    {
      name: "Local emergency assistance",
      availability: "Verify provider details",
      contact: "112",
    },
  ],
};