
'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing encrypted messages for threats.
 *
 * - analyzeThreatMessage - A function that analyzes an encrypted message.
 * - AnalyzeThreatMessageInput - The input type for the analyzeThreatMessage function.
 * - AnalyzeThreatMessageOutput - The return type for the analyzeThreatMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSuspiciousKeywords } from '@/lib/osint-service';

const AnalyzeThreatMessageInputSchema = z.object({
  encryptedMessage: z.string().describe('The encrypted message content.'),
});
export type AnalyzeThreatMessageInput = z.infer<typeof AnalyzeThreatMessageInputSchema>;

const AnalyzeThreatMessageOutputSchema = z.object({
  threatLevel: z.enum(['low', 'medium', 'high']).describe("The assessed threat level of the message."),
  reason: z.string().describe("The reasoning behind the threat level assessment."),
  keywords: z.array(z.string()).describe("A list of identified suspicious keywords."),
  patterns: z.array(z.string()).describe("A list of identified suspicious communication patterns."),
  warrantsReview: z.boolean().describe("Whether the message warrants manual review."),
  riskScore: z.number().describe('A score indicating the risk level of the message.'),
});
export type AnalyzeThreatMessageOutput = z.infer<typeof AnalyzeThreatMessageOutputSchema>;

export async function analyzeThreatMessage(input: AnalyzeThreatMessageInput): Promise<AnalyzeThreatMessageOutput> {
  return analyzeThreatMessageFlow(input);
}

const InternalAnalyzeInputSchema = AnalyzeThreatMessageInputSchema.extend({
    osintKeywords: z.object({
        high: z.array(z.string()),
        medium: z.array(z.string()),
        low: z.array(z.string()),
    }).describe("A list of keywords from OSINT sources, categorized by risk."),
});

const analyzeThreatMessagePrompt = ai.definePrompt({
    name: 'analyzeThreatMessagePrompt',
    input: { schema: InternalAnalyzeInputSchema },
    output: { schema: AnalyzeThreatMessageOutputSchema },
    prompt: `You are a sophisticated AI cybersecurity analyst. Your task is to analyze a given message for potential threats related to illegal activities, specifically drug trafficking. You must determine a threat level (low, medium, high), provide a reason for your assessment, list the specific keywords and communication patterns you identified, and decide if the message warrants manual review by a human analyst. Finally, provide a risk score from 0 (no risk) to 100 (highest risk).

Use the provided OSINT (Open-Source Intelligence) keyword list as a primary source for your analysis. The list is categorized by risk level.

OSINT Keywords:
High-Risk: {{{json osintKeywords.high}}}
Medium-Risk: {{{json osintKeywords.medium}}}
Low-Risk: {{{json osintKeywords.low}}}

Analyze the following message:
Message: "{{{encryptedMessage}}}"

Analysis Criteria:
- **Threat Level:**
  - **High:** The message contains high-risk keywords, or a combination of medium-risk keywords with clear transactional intent (e.g., discussing prices, quantities, meeting points).
  - **Medium:** The message contains medium-risk keywords or multiple low-risk keywords with some suggestion of illicit activity.
  - **Low:** The message contains only low-risk keywords with no clear context of illegal activity, or no suspicious keywords at all.
- **Reason:** Briefly explain your assessment. Mention the specific keywords and context that led to your conclusion.
- **Keywords:** List all suspicious keywords found in the message from the provided OSINT list.
- **Patterns:** Identify any suspicious communication patterns, such as "Mentions of price/quantity", "Arranging a meetup", "Use of coded language", "Inquiring about availability".
- **Warrants Review:** Set to 'true' for messages with 'medium' or 'high' threat levels. Otherwise, set to 'false'.
- **Risk Score:** Assign a score from 0 to 100. High-risk messages should be 75+, medium-risk 40-74, and low-risk below 40.

Provide your analysis in the required JSON format.`,
});

const analyzeThreatMessageFlow = ai.defineFlow(
  {
    name: 'analyzeThreatMessageFlow',
    inputSchema: AnalyzeThreatMessageInputSchema,
    outputSchema: AnalyzeThreatMessageOutputSchema,
  },
  async (input) => {
    const osintKeywords = await getSuspiciousKeywords();
    
    const internalInput = {
        ...input,
        osintKeywords,
    };
    
    const { output } = await analyzeThreatMessagePrompt(internalInput);
    return output!;
  }
);
