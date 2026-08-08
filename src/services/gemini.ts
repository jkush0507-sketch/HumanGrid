import type { Coordinates, EmergencyAnalysis, ServiceMode, Severity } from '@/types';
import { getContactsForMode, getNearbyServices } from './emergency';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-1.5-flash';

export const isGeminiConfigured = Boolean(GEMINI_API_KEY);

const GEMINI_ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * One reusable system instruction per mode. This is the entire mechanism by which
 * the single HumanGrid AI Core changes behavior — no separate bots, just a different
 * instruction + schema constraint depending on the selected service card.
 */
const MODE_INSTRUCTIONS: Record<ServiceMode, string> = {
  hospital: `You are the HumanGrid AI Core running in HOSPITAL mode. Triage medical emergencies described by the user.
Classify the medical category (e.g. cardiac, trauma, respiratory), assess severity, and give short, safe, non-diagnostic first-response guidance (e.g. "call emergency services", "avoid unnecessary movement", "monitor breathing"). Never provide dosages or medical treatment instructions — only immediate safety actions and instructions to seek professional care.`,
  blood_bank: `You are the HumanGrid AI Core running in BLOOD BANK mode. Identify the blood group requested (if mentioned) and the urgency of the request. If no blood group is mentioned, ask for it via the "problem" restatement and set category to "Blood group unspecified".`,
  police: `You are the HumanGrid AI Core running in POLICE mode. Classify the reported incident (e.g. theft, assault, harassment, accident, fraud), assess priority, and give short lawful next-step guidance such as contacting authorities, sharing location, and preserving evidence. Never give instructions that could interfere with an active investigation.`,
  ambulance: `You are the HumanGrid AI Core running in AMBULANCE mode. Assess how urgently transport is needed and give short safety guidance while transport is arranged.`,
  women_safety: `You are the HumanGrid AI Core running in WOMEN SAFETY mode. Assess the danger level from the description, and give short, calm, actionable safety guidance (e.g. move to a public/well-lit area, contact a trusted person, alert nearby authorities). Be sensitive and non-judgmental.`,
  child_safety: `You are the HumanGrid AI Core running in CHILD SAFETY mode. Treat every report as high urgency. Give short, clear steps for a missing or endangered child (e.g. notify police immediately, share a recent photo and last known location, alert nearby security/venue staff, avoid splitting up search efforts unsafely).`,
  food_support: `You are the HumanGrid AI Core running in FOOD SUPPORT mode. Identify the type of food assistance needed (e.g. immediate meal, ongoing supply, for how many people) and point toward community resources.`,
  shelter: `You are the HumanGrid AI Core running in SHELTER SUPPORT mode. Identify who needs shelter (individual/family, any accessibility or safety needs) and the urgency, and point toward shelter resources.`,
};

const RESPONSE_SCHEMA_HINT = `Respond ONLY with a single JSON object (no markdown, no code fences, no commentary) matching exactly this shape:
{
  "problem": string,          // one-sentence restatement of the user's situation
  "category": string,         // short category label
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "required_services": string[],  // e.g. ["Hospital", "Ambulance", "Doctor"]
  "action_steps": string[],   // 2-5 short, immediately actionable steps
  "blood_group": string | null,   // only relevant for blood bank mode, else null
  "danger_level": string | null   // only relevant for women/child safety modes, else null
}`;

interface RawGeminiAnalysis {
  problem: string;
  category: string;
  severity: Severity;
  required_services: string[];
  action_steps: string[];
  blood_group?: string | null;
  danger_level?: string | null;
}

/**
 * Runs the user's free-text description through Gemini using the instruction
 * for the currently selected mode, then enriches the structured result with
 * live-ish nearby services and quick-dial contacts to produce a complete
 * EmergencyAnalysis ready for the UI.
 */
export async function analyzeEmergency(
  mode: ServiceMode,
  userInput: string,
  origin: Coordinates | null
): Promise<EmergencyAnalysis> {
  const raw = isGeminiConfigured
    ? await callGemini(mode, userInput)
    : fallbackAnalysis(mode, userInput);

  const nearby_services = origin ? await getNearbyServices(mode, origin) : [];
  const contacts = getContactsForMode(mode);

  return {
    problem: raw.problem,
    category: raw.category,
    severity: raw.severity,
    required_services: raw.required_services,
    action_steps: raw.action_steps,
    contacts,
    nearby_services,
    mode,
    blood_group: raw.blood_group ?? undefined,
    danger_level: raw.danger_level ?? undefined,
  };
}

async function callGemini(mode: ServiceMode, userInput: string): Promise<RawGeminiAnalysis> {
  const systemInstruction = `${MODE_INSTRUCTIONS[mode]}\n\n${RESPONSE_SCHEMA_HINT}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  };

  try {
    const res = await fetch(GEMINI_ENDPOINT(GEMINI_MODEL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(stripCodeFences(text)) as RawGeminiAnalysis;
    return sanitizeRaw(parsed);
  } catch (err) {
    // Network failure, bad key, or malformed response — degrade gracefully
    // rather than leaving the user without any guidance.
    // eslint-disable-next-line no-console
    console.error('[HumanGrid] Gemini call failed, using local fallback classifier.', err);
    return fallbackAnalysis(mode, userInput);
  }
}

function stripCodeFences(text: string): string {
  return text.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
}

function sanitizeRaw(raw: Partial<RawGeminiAnalysis>): RawGeminiAnalysis {
  const validSeverities: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  return {
    problem: raw.problem || 'Situation reported by user.',
    category: raw.category || 'General emergency',
    severity: validSeverities.includes(raw.severity as Severity) ? (raw.severity as Severity) : 'MEDIUM',
    required_services: Array.isArray(raw.required_services) ? raw.required_services : [],
    action_steps: Array.isArray(raw.action_steps) ? raw.action_steps : [],
    blood_group: raw.blood_group ?? null,
    danger_level: raw.danger_level ?? null,
  };
}

/**
 * Lightweight rule-based classifier used when no Gemini API key is configured
 * (e.g. local UI preview) or if the live call fails. Keeps the product fully
 * demoable without external dependencies while preserving the exact same
 * output contract as the AI path.
 */
function fallbackAnalysis(mode: ServiceMode, userInput: string): RawGeminiAnalysis {
  const text = userInput.toLowerCase();
  const critical = /chest pain|not breathing|unconscious|missing|stabbed|bleeding heavily|can't breathe|cannot breathe/.test(
    text
  );
  const high = /stolen|assault|unsafe|threat|accident|injured|fire/.test(text);

  const severity: Severity = critical ? 'CRITICAL' : high ? 'HIGH' : 'MEDIUM';

  const byMode: Record<ServiceMode, RawGeminiAnalysis> = {
    hospital: {
      problem: userInput,
      category: 'Medical emergency',
      severity,
      required_services: ['Hospital', 'Ambulance', 'Doctor'],
      action_steps: ['Call emergency services.', 'Avoid unnecessary movement.', 'Monitor breathing.'],
    },
    blood_bank: {
      problem: userInput,
      category: 'Blood request',
      severity: critical ? 'CRITICAL' : 'HIGH',
      required_services: ['Blood Bank'],
      action_steps: ['Contact the nearest blood bank.', 'Confirm blood group and quantity needed.'],
      blood_group: extractBloodGroup(userInput),
    },
    police: {
      problem: userInput,
      category: 'Theft or incident report',
      severity: high ? 'HIGH' : 'MEDIUM',
      required_services: ['Police'],
      action_steps: ['Contact authorities.', 'Share the location.', 'Preserve evidence.'],
    },
    ambulance: {
      problem: userInput,
      category: 'Transport emergency',
      severity,
      required_services: ['Ambulance'],
      action_steps: ['Call emergency services.', 'Stay in a safe, accessible location.'],
    },
    women_safety: {
      problem: userInput,
      category: 'Personal safety concern',
      severity: high ? 'HIGH' : 'MEDIUM',
      required_services: ['Police', 'Trusted Contact'],
      action_steps: ['Move to a public, well-lit area if possible.', 'Alert a trusted contact.', 'Consider activating SOS.'],
      danger_level: high ? 'Elevated' : 'Moderate',
    },
    child_safety: {
      problem: userInput,
      category: 'Missing or endangered child',
      severity: 'CRITICAL',
      required_services: ['Police'],
      action_steps: [
        'Notify police immediately.',
        'Share a recent photo and last known location.',
        'Alert nearby security or venue staff.',
      ],
      danger_level: 'Critical',
    },
    food_support: {
      problem: userInput,
      category: 'Food assistance request',
      severity: 'LOW',
      required_services: ['NGO', 'Community Kitchen'],
      action_steps: ['Locate the nearest community kitchen.', 'Check NGO hours before traveling.'],
    },
    shelter: {
      problem: userInput,
      category: 'Shelter request',
      severity: high ? 'HIGH' : 'MEDIUM',
      required_services: ['Shelter'],
      action_steps: ['Locate the nearest available shelter.', 'Call ahead to confirm space.'],
    },
  };

  return byMode[mode];
}

function extractBloodGroup(text: string): string | null {
  const match = text.match(/\b(A|B|AB|O)\s?(\+|positive|-|negative)\b/i);
  if (!match) return null;
  const group = match[1].toUpperCase();
  const sign = /pos|\+/i.test(match[2]) ? '+' : '-';
  return `${group}${sign}`;
}
