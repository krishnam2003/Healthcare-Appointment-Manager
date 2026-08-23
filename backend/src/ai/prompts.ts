import type { LLMSummaryType } from '../generated/prisma/client';

import type { AiAppointmentContext } from './repository';

export type SummaryPrompt = Readonly<{
  system: string;
  user: string;
  version: string;
}>;

function formatAppointmentContext(
  appointment: AiAppointmentContext,
): string {
  return [
    `Appointment status: ${appointment.status}`,
    `Doctor specialization: ${appointment.doctor.specialization.name}`,
  ].join('\n');
}

export function buildPreVisitPrompt(
  appointment: AiAppointmentContext,
): SummaryPrompt {
  const symptoms = appointment.symptoms;

  return {
    version: 'pre-visit-v2',

    system: `
You are a clinical documentation assistant.

Your task is to summarize patient-reported symptoms for a doctor.

IMPORTANT RULES:
- Do not diagnose the patient.
- Do not invent symptoms, conditions, medications, or medical history.
- Base the response only on the information provided.
- The urgency level is a triage-style indicator, not a medical diagnosis.
- If information is insufficient, choose LOW or MEDIUM rather than inventing facts.
- Keep the summary concise and clinically useful.

Return ONLY valid JSON.
`.trim(),

    user: `
${formatAppointmentContext(appointment)}

Patient symptom submission:

Symptoms:
${symptoms?.symptoms ?? 'Not provided'}

Duration:
${symptoms?.duration ?? 'Not provided'}

Severity:
${symptoms?.severity ?? 'Not provided'}

Additional notes:
${symptoms?.additionalNotes ?? 'Not provided'}

Return exactly this JSON structure:

{
  "content": "Short clinical summary of the reported symptoms",
  "urgencyLevel": "LOW",
  "chiefComplaint": "Main reported complaint",
  "suggestedQuestions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}

Rules:
- urgencyLevel must be exactly LOW, MEDIUM, or HIGH.
- suggestedQuestions must contain exactly 3 strings.
- Do not include diagnosis.
- Do not include information that was not provided.
`.trim(),
  };
}

export function buildPostVisitPrompt(
  appointment: AiAppointmentContext,
): SummaryPrompt {
  const prescription = appointment.prescription;

  return {
    version: 'post-visit-v2',

    system: `
You are a healthcare documentation assistant.

Convert the doctor's clinical notes into a clear, patient-friendly follow-up summary.

IMPORTANT RULES:
- Do not diagnose.
- Do not invent medical information.
- Do not change medication names, doses, or frequencies.
- Use only information provided by the doctor.
- If information is missing, say that it was not provided.
- Do not create a medication schedule if no medication information is provided.

Return ONLY valid JSON.
`.trim(),

    user: `
${formatAppointmentContext(appointment)}

Clinical visit information:

Clinical notes:
${prescription?.clinicalNotes ?? 'Not provided'}

Doctor notes:
${prescription?.doctorNotes ?? 'Not provided'}

Medicines:
${JSON.stringify(prescription?.medicines ?? [])}

Return exactly:

{
  "content": "Patient-friendly explanation of the visit",
  "medicationSchedule": [],
  "followUpGuidance": "Follow-up instructions"
}

Medication schedule should be an array of objects.

Example:

[
  {
    "medicine": "Medicine name",
    "dose": "Dose",
    "frequency": "Frequency",
    "instructions": "Additional instructions"
  }
]

Only include medication information present in the doctor's prescription.

Do not invent dosage or frequency.
`.trim(),
  };
}
export function fallbackSummaryContent(type: LLMSummaryType): string {
  return type === 'PRE_VISIT'
    ? 'AI pre-visit summary is unavailable. Configure the AI provider API key to enable this feature.'
    : 'AI post-visit summary is unavailable. Configure the AI provider API key to enable this feature.';
}
