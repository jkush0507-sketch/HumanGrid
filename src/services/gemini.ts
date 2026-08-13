import type {
  Coordinates,
  EmergencyAnalysis,
  ServiceMode,
  Severity,
} from "@/types";
import {
  getContactsForMode,
  getNearbyServices,
} from "./emergency";

const GEMINI_API_KEY = import.meta.env
  .VITE_GEMINI_API_KEY as string | undefined;

const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as
    | string
    | undefined) || "gemini-1.5-flash";

export const isGeminiConfigured =
  Boolean(GEMINI_API_KEY);

const GEMINI_ENDPOINT = (
  model: string
): string =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

const MODE_INSTRUCTIONS: Record<
  ServiceMode,
  string
> = {
  hospital: `
You are HumanGrid AI in hospital-assistance mode.

Help the user understand the urgency of a possible medical emergency.
Give short, safe, non-diagnostic guidance. Never prescribe medicines,
dosages, or treatment plans. Never claim to be a doctor.

For unconsciousness, severe bleeding, difficulty breathing, chest pain,
suspected stroke, major trauma, or serious accidents, classify the situation
as HIGH or CRITICAL and prioritize emergency escalation.
`,

  blood_bank: `
You are HumanGrid AI in blood-bank mode.

Help identify blood group, quantity, urgency, and patient-support needs.
Recommend contacting a verified blood bank, hospital, or emergency service.
Never invent blood availability, donors, hospitals, phone numbers, or locations.
`,

  police: `
You are HumanGrid AI in police and security mode.

Help with threats, violence, theft, harassment, missing people, and security
emergencies. Prioritize reaching a safer place, contacting authorities, and
sharing location with a trusted person. Do not encourage confrontation.
Never claim that police have been contacted.
`,

  ambulance: `
You are HumanGrid AI in ambulance mode.

Prioritize urgent medical transport and emergency escalation. Give short safety
guidance while help is being arranged. Never claim that an ambulance has been
dispatched.
`,

  women_safety: `
You are HumanGrid AI in women-safety mode.

Prioritize immediate personal safety. Suggest moving to a public, well-lit, or
trusted location when possible. Suggest contacting a trusted person and local
emergency authorities when necessary. Never blame the user and never claim
that anyone was notified.
`,

  child_safety: `
You are HumanGrid AI in child-safety mode.

Prioritize the child's immediate safety. For a missing, endangered, injured,
or abused child, recommend contacting responsible adults and authorities
immediately. Never encourage unsafe searching or confrontation.
`,

  food_support: `
You are HumanGrid AI in food-support mode.

Help clarify whether the user needs a meal, food supplies, or ongoing support.
Ask how many people need help and where they are located. Do not invent
organizations, availability, phone numbers, or locations.
`,

  shelter: `
You are HumanGrid AI in shelter-support mode.

Help identify who needs safe shelter, urgency, accessibility needs, and safety
concerns. Recommend verified shelters, local authorities, or relief groups.
Do not invent bed availability, organizations, phone numbers, or addresses.
`,

  general_emergency: `
You are HumanGrid AI in general-emergency mode.

Classify the situation as medical, accident, fire, police/security,
personal safety, child safety, disaster, missing person, animal emergency,
food support, shelter support, or general emergency.

Prioritize immediate safety and emergency escalation. If there may be immediate
danger to life, classify the situation as HIGH or CRITICAL and tell the user
to contact local emergency services immediately.

Never claim that HumanGrid, police, ambulance, volunteers, hospitals, or any
authority has been contacted. Do not invent providers or locations.
`,
};

const RESPONSE_SCHEMA_HINT = `
Return only one valid JSON object. Do not return markdown, code fences,
or explanatory text outside the JSON object.

Use this shape:

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
  "why": "short reason",
  "warnings": ["important safety warnings"],
  "next_steps": ["clear next steps"],
  "blood_group": "string or null",
  "danger_level": "string or null"
}

For critical situations, the first action must prioritize contacting local emergency
services or moving away from immediate danger when safe.

Never claim that a call, dispatch, notification, SOS, or report has already happened.
`;

interface RawGeminiAnalysis {
  emergency_type?: string;
  severity?: Severity;
  summary?: string;
  problem?: string;
  category?: string;
  immediate_actions?: string[];
  action_steps?: string[];
  recommended_service?: ServiceMode;
  required_services?: string[];
  why?: string;
  warnings?: string[];
  next_steps?: string[];
  blood_group?: string | null;
  danger_level?: string | null;
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

  return {
    problem: result.raw.problem ?? "Emergency reported.",
    category:
      result.raw.category ?? defaultCategory(mode),
    severity:
      result.raw.severity ?? "MEDIUM",
    required_services:
      result.raw.required_services ?? [],
    action_steps:
      result.raw.action_steps ??
      result.raw.immediate_actions ??
      [],
    immediate_actions:
      result.raw.immediate_actions ??
      result.raw.action_steps ??
      [],
    contacts: getContactsForMode(mode),
    nearby_services: nearbyServices,
    mode,
    emergency_type:
      result.raw.emergency_type ??
      defaultEmergencyType(mode),
    summary:
      result.raw.summary ??
      "The situation needs appropriate support.",
    recommended_service:
      result.raw.recommended_service ?? mode,
    why:
      result.raw.why ??
      "This is the selected support category.",
    warnings: result.raw.warnings ?? [],
    next_steps: result.raw.next_steps ?? [],
    blood_group:
      result.raw.blood_group ?? undefined,
    danger_level:
      result.raw.danger_level ?? undefined,
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
      raw: sanitizeAnalysis(raw, mode, userInput),
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
  const body = {
    system_instruction: {
      parts: [
        {
          text:
            `${MODE_INSTRUCTIONS[mode]}\n` +
            RESPONSE_SCHEMA_HINT,
        },
      ],
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

  const response = await fetch(
    GEMINI_ENDPOINT(GEMINI_MODEL),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as GeminiResponseData;

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed: unknown = JSON.parse(
    stripCodeFences(text)
  );

  if (!isRecord(parsed)) {
    throw new Error(
      "Gemini returned an invalid response"
    );
  }

  return parsed as RawGeminiAnalysis;
}

function sanitizeAnalysis(
  raw: RawGeminiAnalysis,
  mode: ServiceMode,
  userInput: string
): RawGeminiAnalysis {
  const severity = isSeverity(raw.severity)
    ? raw.severity
    : "MEDIUM";

  const immediateActions =
    normalizeStrings(raw.immediate_actions);

  const actionSteps =
    normalizeStrings(raw.action_steps);

  const safeActions =
    immediateActions.length > 0
      ? immediateActions
      : actionSteps.length > 0
        ? actionSteps
        : defaultActions(severity);

  return {
    emergency_type:
      raw.emergency_type ??
      defaultEmergencyType(mode),
    severity,
    summary:
      raw.summary ??
      "The situation needs appropriate support.",
    problem:
      raw.problem ??
      userInput ??
      "Emergency situation reported.",
    category:
      raw.category ??
      defaultCategory(mode),
    immediate_actions: safeActions,
    action_steps: safeActions,
    recommended_service:
      isServiceMode(raw.recommended_service)
        ? raw.recommended_service
        : mode,
    required_services:
      normalizeStrings(raw.required_services)
        .length > 0
        ? normalizeStrings(raw.required_services)
        : [mode],
    why:
      raw.why ??
      "This is the relevant support category for the selected mode.",
    warnings:
      normalizeStrings(raw.warnings),
    next_steps:
      normalizeStrings(raw.next_steps).length > 0
        ? normalizeStrings(raw.next_steps)
        : [
            "Contact an appropriate local emergency or support service.",
          ],
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

  const actions = defaultActionsForMode(
    mode,
    severity
  );

  return {
    emergency_type: defaultEmergencyType(mode),
    severity,
    summary:
      "AI analysis is temporarily unavailable. These are general emergency guidance steps.",
    problem:
      userInput || "Emergency situation reported.",
    category: defaultCategory(mode),
    immediate_actions: actions,
    action_steps: actions,
    recommended_service: mode,
    required_services: [mode],
    why:
      "This is a fallback recommendation based on the selected mode.",
    warnings: [
      "AI analysis is temporarily unavailable.",
      "Verify important details with an appropriate professional or local service.",
    ],
    next_steps: [
      "Contact an appropriate local emergency or support service.",
      "Do not treat this fallback guidance as a diagnosis or official dispatch.",
    ],
    blood_group:
      mode === "blood_bank"
        ? extractBloodGroup(userInput)
        : null,
    danger_level:
      mode === "women_safety" ||
      mode === "child_safety"
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
      "Move away from immediate danger if safe.",
      "Stay with the affected person if possible.",
    ];
  }

  switch (mode) {
    case "hospital":
      return [
        "Contact a medical professional or emergency service.",
        "Avoid unnecessary movement after serious injury.",
        "Monitor breathing and responsiveness.",
      ];

    case "ambulance":
      return [
        "Contact emergency services for transport.",
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
        "Contact emergency authorities if in immediate danger.",
      ];

    case "child_safety":
      return [
        "Contact responsible adults and authorities immediately.",
        "Share a recent photo and last known location.",
        "Avoid unsafe searching or confrontation.",
      ];

    case "blood_bank":
      return [
        "Confirm blood group and quantity with the hospital.",
        "Contact a verified blood bank or hospital.",
        "Keep hospital and contact details ready.",
      ];

    case "food_support":
      return [
        "Confirm how many people need food.",
        "Contact a verified support organization.",
        "Share the collection or delivery location safely.",
      ];

    case "shelter":
      return [
        "Move to a safe location if in immediate danger.",
        "Contact a verified shelter or relief organization.",
        "Confirm availability before traveling.",
      ];

    case "general_emergency":
      return [
        "Move away from immediate danger if safe.",
        "Contact the appropriate local emergency service.",
        "Share your location with a trusted person.",
      ];

    default:
      return [
        "Contact local emergency or support services.",
        "Move to a safe location if necessary.",
      ];
  }
}

function defaultActions(
  severity: Severity
): string[] {
  return severity === "CRITICAL"
    ? [
        "Contact local emergency services immediately.",
        "Move away from immediate danger if safe.",
      ]
    : [
        "Contact an appropriate local support service.",
        "Move to a safe location if necessary.",
      ];
}

function defaultEmergencyType(
  mode: ServiceMode
): string {
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

    default:
      return "general";
  }
}

function defaultCategory(
  mode: ServiceMode
): string {
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

    default:
      return "General emergency";
  }
}

function extractBloodGroup(
  text: string
): string | null {
  const match = text.match(
    /\b(A|B|AB|O)\s?(\+|positive|-|negative)\b/i
  );

  if (!match) {
    return null;
  }

  const group = match[1].toUpperCase();
  const sign = /pos|\+/i.test(match[2])
    ? "+"
    : "-";

  return `${group}${sign}`;
}

function normalizeStrings(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
}

function isSeverity(
  value: unknown
): value is Severity {
  return (
    value === "LOW" ||
    value === "MEDIUM" ||
    value === "HIGH" ||
    value === "CRITICAL"
  );
}

function isServiceMode(
  value: unknown
): value is ServiceMode {
  return (
    value === "hospital" ||
    value === "police" ||
    value === "blood_bank" ||
    value === "shelter" ||
    value === "women_safety" ||
    value === "child_safety" ||
    value === "food_support" ||
    value === "ambulance" ||
    value === "general_emergency"
  );
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function stripCodeFences(
  text: string
): string {
  return text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}