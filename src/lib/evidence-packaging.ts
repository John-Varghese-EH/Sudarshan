
/**
 * @fileoverview Systems for evidence packaging, storing proof of scams, and generating safety reports.
 */

import { z } from 'zod';

export const EvidenceSchema = z.object({
  timestamp: z.string().datetime(),
  type: z.enum(['phishing_site', 'malicious_app', 'scam_ad', 'unsafe_link', 'fake_upi_request']),
  data: z.any(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

// In-memory storage for evidence. In a real app, this would be a database.
const evidenceStore: Evidence[] = [];

/**
 * Adds a piece of evidence to the store.
 * @param evidence The evidence to add.
 */
export const addEvidence = (evidence: Evidence) => {
  const validationResult = EvidenceSchema.safeParse(evidence);
  if (validationResult.success) {
    evidenceStore.push(validationResult.data);
    console.log('Evidence added:', validationResult.data);
  } else {
    console.error('Invalid evidence format:', validationResult.error);
  }
};

/**
 * Generates a safety report.
 * @returns A string containing the safety report.
 */
export const generateSafetyReport = (): string => {
  if (evidenceStore.length === 0) {
    return 'No evidence collected yet.';
  }

  const report = evidenceStore
    .map((evidence) => `[${evidence.timestamp}] ${evidence.type}: ${JSON.stringify(evidence.data)}`)
    .join('\n');

  return `Safety Report:\n${report}`;
};

/**
 * Gets all collected evidence.
 * @returns An array of all evidence.
 */
export const getAllEvidence = (): Evidence[] => {
  return [...evidenceStore];
};
