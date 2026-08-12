import type {
  Coordinates,
  EmergencyAnalysis,
  ServiceMode,
  Severity,
} from "@/types";
import { getContactsForMode, getNearbyServices } from "./emergency";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as
  | string
  | undefined;

const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ||
  "gemini-1.5-flash";

export const isGeminiConfigured = Boolean(GEMINI_API_KEY);

const GEMINI_ENDPOINT = (model: string): string =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

const MODE_INSTRUCTIONS: Record<ServiceMode, string> = {
  hospital: `
You are HumanGrid AI in hospital-assistance mode.

Help the user describe a possible medical emergency and understand its urgency.
Give short, safe, non-diagnostic guidance. Prioritize calling emergency services
for serious symptoms. Never prescribe medicine, dosages, treatment plans, or
guarantees. Never claim to be a doctor.

For signs such as unconsciousness, severe bleeding, difficulty breathing, chest
pain, suspected stroke, major trauma, or a serious accident, classify the
situation as HIGH or CRITICAL and put immediate emergency escalation first.
`,

  blood_bank: `
You are HumanGrid AI in blood-bank mode.

Help identify blood-group, quantity, urgency, and patient-support requirements.
Recommend contacting a verified blood bank, hospital, or emergency service.
Never invent blood availability, hospitals, donors, phone numbers, or locations.
If the blood group is missing, say that it must be confirmed with the treating
hospital or medical team.
`,

  police: `
You are HumanGrid AI in police and security mode.

Help with crimes, threats, violence, theft, harassment, missing people, and
security emergencies. Prioritize moving to a safer place when possible,
contacting emergency authorities, and sharing the location with a trusted
person. Do not encourage confrontation. Do not give instructions to interfere
with evidence or an investigation. Never claim that police have been contacted.
`,

  ambulance: `
You are HumanGrid AI in ambulance mode.

Prioritize immediate medical transport and emergency escalation. For serious
medical symptoms, tell the user to contact local emergency services immediately.
Give only short safety steps while help is being arranged. Never claim that an
ambulance has been dispatched.
`,

  women_safety: `
You are HumanGrid AI in women-safety mode.

Prioritize immediate personal safety. Suggest moving to a public, well-lit, or
trusted location when possible, contacting a trusted person, and calling
emergency authorities if there is immediate danger. Be calm and non-judgmental.
Never blame the user and never claim that authorities or contacts were notified.
`,

  child_safety: `
You are HumanGrid AI in child-safety mode.

Prioritize the child's immediate safety. For a missing, endangered, injured, or
abused child, recommend contacting authorities and responsible adults
immediately. Suggest sharing a recent photo and last known location with
appropriate authorities. Never encourage unsafe searching or confrontation.
Never claim that authorities have been contacted.
`,

  food_support: `
You are HumanGrid AI in food-support mode.

Help clarify whether the user needs an immediate meal, food supplies, or
ongoing assistance, and how many people need help. Recommend verified local
community resources when available. Do not invent organizations, availability,
phone numbers, or locations.
`,

  shelter: `
You are HumanGrid AI in shelter-support mode.

Help identify who needs safe shelter, urgency, accessibility needs, and safety
concerns. Recommend contacting verified shelters, local authorities, or trusted
relief organizations. Do not invent bed availability, organizations, phone
numbers, or addresses.
`,

  general_emergency: `
You are HumanGrid AI in general-emergency mode.

Classify the situation into the most relevant category, such as medical,
accident, fire, police/security, personal safety, child safety, disaster,
missing person, animal emergency, food support, shelter, or another emergency.

Prioritize immediate safety and emergency escalation. If there may be immediate
danger to life, classify the severity as HIGH or CRITICAL and tell the user to
contact local emergency services immediately. Never claim that HumanGrid,
police, ambulance, volunteers, hospitals, or any authority has been contacted.
Do not invent service providers, locations, availability, or phone numbers.
`,
};

const RESPONSE_SCHEMA_HINT = `
Return ONLY one valid JSON object. Do not use markdown, code fences, or extra
commentary.

The object must have exactly this conceptual structure:

{
  "emergency_type": "medical | accident | fire | police | women_safety | child_safety | blood_requirement | food_requirement | shelter_requirement | missing_person | disaster | animal_emergency | general",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "summary": "short safe summary",
  "problem": "one-sentence restatement",
  "category": "short category label",
  "immediate_actions": ["2 to 5 short actions"],
  "action_steps": ["same or compatible immediate actions"],
  "recommended_service": "hospital | blood_bank | police | ambulance | women_safety | child_safety | food_support | shelter | general_emergency",
  "required_services": ["relevant services"],
  "why": "short reason for the recommendation",
  "warnings": ["important safety warnings"],
  "next_steps": ["clear next steps"],
  "blood_group": "string or null",
  "danger_level": "string or null"
}

For critical situations, the first immediate action must be to contact
appropriate local emergency services or move away from immediate danger when
possible.

Do not state that any call, dispatch, notification, or report has already
happened.
`;

interface RawGeminiAnalysis {
  emergency_type: string;
  severity: Severity;
  summary: string;
  problem: string;
  category: string;
  immediate_actions: string[];
  action_steps: string[];
  recommended_service: ServiceMode;
  required_services: string[];
  why: string;
  warnings: string[];
  next_steps: string[];
  blood_group: string | null;
  danger_level: string | null;
}

interface GeminiResponseData {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface AnalysisResult {
  raw: RawGeminiAnalysis;
  source: "gemini" | "fallback";
}

export async function analyzeEmergency(
  mode: ServiceMode,
  userInput: string,
  origin: Coordinates | null
): Promise<EmergencyAnalysis> {
  const cleanInput = userInput.trim();

  const result = isGeminiConfigured
    ? await callGeminiSafely(mode, cleanInput)
    : {
        raw: fallbackAnalysis(mode, cleanInput),
        source: "fallback" as const,
      };

  const nearbyServices = origin
    ? await getNearbyServices(mode, origin)
    : [];

  const contacts = getContactsForMode(mode);

  return {
    problem: result.raw.problem,
    category: result.raw.category,
    severity: result.raw.severity,
    required_services: result.raw.required_services,
    action_steps: result.raw.action_steps,
    contacts,
    nearby_services: nearbyServices,
    mode,

    emergency_type: result.raw.emergency_type,
    summary: result.raw.summary,
    recommended_service: result.raw.recommended_service,
    why: result.raw.why,
    warnings: result.raw.warnings,
    next_steps: result.raw.next_steps,

    blood_group: result.raw.blood_group ?? undefined,
    danger_level: result.raw.danger_level ?? undefined,
    source: result.source,
  };
}

async function callGeminiSafely(
  mode: ServiceMode,
  userInput: string
): Promise<AnalysisResult> {
  try {
    const raw = await callGemini(mode, userInput);

    return {
      raw: sanitizeRaw(raw, mode, userInput),
      source: "gemini",
    };
  } catch {
    return {
      raw: fallbackAnalysis(mode, userInput),
      source: "fallback",
    };
  }
}

async function callGemini(
  mode: ServiceMode,
  userInput: string
): Promise<RawGeminiAnalysis> {
  const systemInstruction = `${MODE_INSTRUCTIONS[mode]}\n${RESPONSE_SCHEMA_HINT}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(GEMINI_ENDPOINT(GEMINI_MODEL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponseData;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed: unknown = JSON.parse(stripCodeFences(text));

  if (!isRecord(parsed)) {
    throw new Error("Gemini returned an invalid response object");
  }

  return parsed as unknown as RawGeminiAnalysis;
}

function sanitizeRaw(
  raw: Partial<RawGeminiAnalysis>,
  mode: ServiceMode,
  userInput: string
): RawGeminiAnalysis {
  const validSeverities: Severity[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ];

  const severity = validSeverities.includes(raw.severity as Severity)
    ? (raw.severity as Severity)
    : "MEDIUM";

  const immediateActions = normalizeStringArray(
    raw.immediate_actions
  );

  const actionSteps = normalizeStringArray(raw.action_steps);
  const warnings = normalizeStringArray(raw.warnings);
  const nextSteps = normalizeStringArray(raw.next_steps);
  const requiredServices = normalizeStringArray(
    raw.required_services
  );

  const safeActions =
    immediateActions.length > 0
      ? immediateActions
      : actionSteps.length > 0
        ? actionSteps
        : defaultActionsForSeverity(severity);

  const safeWarnings =
    severity === "CRITICAL" && warnings.length === 0
      ? [
          "If there is immediate danger to life, contact local emergency services now.",
        ]
      : warnings;

  const recommendedService = isServiceMode(
    raw.recommended_service
  )
    ? raw.recommended_service
    : defaultServiceForMode(mode);

  return {
    emergency_type:
      raw.emergency_type || defaultEmergencyType(mode),
    severity,
    summary:
      raw.summary ||
      "The situation needs careful attention and appropriate support.",
    problem: raw.problem || userInput || "Emergency situation reported.",
    category: raw.category || defaultCategoryForMode(mode),
    immediate_actions: safeActions,
    action_steps: safeActions,
    recommended_service: recommendedService,
    required_services:
      requiredServices.length > 0
        ? requiredServices
        : [recommendedService],
    why:
      raw.why ||
      "This service is the closest relevant support category for the situation described.",
    warnings: safeWarnings,
    next_steps:
      nextSteps.length > 0
        ? nextSteps
        : ["Contact an appropriate local emergency or support service."],
    blood_group: raw.blood_group ?? null,
    danger_level: raw.danger_level ?? null,
  };
}

function fallbackAnalysis(
  mode: ServiceMode,
  userInput: string
): RawGeminiAnalysis {
  const text = userInput.toLowerCase();

  const critical =
    /not breathing|cannot breathe|can't breathe|unconscious|severe bleeding|bleeding heavily|chest pain|heart attack|active fire|immediate danger|being attacked|child in danger/.test(
      text
    );

  const high =
    /accident|injured|assault|threat|unsafe|stolen|missing|violence|fire|flood|earthquake/.test(
      text
    );

  const severity: Severity = critical
    ? "CRITICAL"
    : high
      ? "HIGH"
      : "MEDIUM";

  const actionSteps = defaultActionsForMode(mode, severity);

  const warnings =
    severity === "CRITICAL"
      ? [
          "AI analysis is temporarily unavailable.",
          "Contact local emergency services immediately if there is immediate danger to life.",
        ]
      : [
          "AI analysis is temporarily unavailable.",
          "Verify important details with an appropriate professional or local service.",
        ];

  return {
    emergency_type: defaultEmergencyType(mode),
    severity,
    summary:
      "AI analysis is temporarily unavailable. These are general emergency guidance steps.",
    problem: userInput || "Emergency situation reported.",
    category: defaultCategoryForMode(mode),
    immediate_actions: actionSteps,
    action_steps: actionSteps,
    recommended_service: defaultServiceForMode(mode),
    required_services: [defaultServiceForMode(mode)],
    why: "This is a general fallback recommendation based on the selected mode.",
    warnings,
    next_steps: [
      "Contact an appropriate local emergency or support service.",
      "Do not rely on this fallback guidance as a diagnosis or official dispatch.",
    ],
    blood_group:
      mode === "blood_bank" ? extractBloodGroup(userInput) : null,
    danger_level:
      mode === "women_safety" || mode === "child_safety"
        ? severity === "CRITICAL"
          ? "Critical"
          : "Elevated"
        : null,
  };
}

function defaultActionsForMode(
  mode: ServiceMode,
  severity: Severity
): string[] {
  if (severity === "CRITICAL") {
    return [
      "Contact local emergency services immediately.",
      "Move away from immediate danger if it is safe to do so.",
      "Stay with the affected person and monitor the situation.",
    ];
  }

  switch (mode) {
    case "hospital":
      return [
        "Contact a medical professional or emergency service.",
        "Avoid unnecessary movement after a serious injury.",
        "Monitor breathing and responsiveness.",
      ];

    case "ambulance":
      return [
        "Contact emergency services for medical transport.",
        "Stay in a safe and accessible location.",
        "Keep relevant medical information ready.",
      ];

    case "police":
      return [
        "Move to a safer location if possible.",
        "Contact local police or emergency authorities.",
        "Share your location with a trusted person.",
      ];

    case "women_safety":
      return [
        "Move to a public or well-lit location if possible.",
        "Alert a trusted person.",
        "Contact emergency authorities if there is immediate danger.",
      ];

    case "child_safety":
      return [
        "Contact responsible adults and authorities immediately.",
        "Share the child's recent photo and last known location.",
        "Avoid unsafe searching or confrontation.",
      ];

    case "blood_bank":
      return [
        "Confirm the blood group and quantity with the treating hospital.",
        "Contact a verified blood bank or hospital.",
        "Keep the patient's hospital and contact details ready.",
      ];

    case "food_support":
      return [
        "Confirm how many people need food.",
        "Contact a verified community or relief organization.",
        "Share the delivery or collection location safely.",
      ];

    case "shelter":
      return [
        "Move to a safe location if you are in immediate danger.",
        "Contact a verified shelter or relief organization.",
        "Confirm accessibility and availability before traveling.",
      ];

    case "general_emergency":
      return [
        "Move away from immediate danger if it is safe to do so.",
        "Contact the appropriate local emergency or support service.",
        "Share your location with a trusted person.",
      ];
  }
}

function defaultActionsForSeverity(severity: Severity): string[] {
  return severity === "CRITICAL"
    ? [
        "Contact local emergency services immediately.",
        "Move away from immediate danger if safe.",
        "Stay with the affected person if possible.",
      ]
    : [
        "Contact an appropriate local emergency or support service.",
        "Move to a safe location if necessary.",
      ];
}

function defaultEmergencyType(mode: ServiceMode): string {
  switch (mode) {
    case "hospital":
    case "ambulance":
      return "medical";

    case "blood_bank":
      return "blood_requirement";

    case "police":
      return "police";

    case "women_safety":
      return "women_safety";

    case "child_safety":
      return "child_safety";

    case "food_support":
      return "food_requirement";

    case "shelter":
      return "shelter_requirement";

    case "general_emergency":
      return "general";
  }
}

function defaultCategoryForMode(mode: ServiceMode): string {
  switch (mode) {
    case "hospital":
      return "Medical emergency";

    case "blood_bank":
      return "Blood requirement";

    case "police":
      return "Police or security emergency";

    case "ambulance":
      return "Medical transport";

    case "women_safety":
      return "Women safety concern";

    case "child_safety":
      return "Child safety concern";

    case "food_support":
      return "Food support request";

    case "shelter":
      return "Shelter support request";

    case "general_emergency":
      return "General emergency";
  }
}

function defaultServiceForMode(mode: ServiceMode): ServiceMode {
  return mode;
}

function extractBloodGroup(text: string): string | null {
  const match = text.match(
    /\b(A|B|AB|O)\s?(\+|positive|-|negative)\b/i
  );

  if (!match) {
    return null;
  }

  const group = match[1].toUpperCase();
  const sign = /pos|\+/i.test(match[2]) ? "+" : "-";

  return `${group}${sign}`;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
}

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isServiceMode(value: unknown): value is ServiceMode {
  return (
    value === "hospital" ||
    value === "blood_bank" ||
    value === "police" ||
    value === "ambulance" ||
    value === "women_safety" ||
    value === "child_safety" ||
    value === "food_support" ||
    value === "shelter" ||
    value === "general_emergency"
  );
}