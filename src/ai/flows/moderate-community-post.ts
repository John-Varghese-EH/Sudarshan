
'use server';
/**
 * @fileOverview A Genkit flow for moderating community posts.
 *
 * - moderateCommunityPost - A function that analyzes text and determines if it's appropriate.
 * - ModerateCommunityPostInput - The input type for the function.
 * - ModerateCommunityPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSuspiciousKeywords } from '@/lib/osint-service';

const ModerateCommunityPostInputSchema = z.object({
  text: z.string().describe('The text content of the community post.'),
});
export type ModerateCommunityPostInput = z.infer<typeof ModerateCommunityPostInputSchema>;

const ModerateCommunityPostOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether the content is appropriate for a public community forum.'),
  reason: z.string().optional().describe('The reason for flagging the content, if applicable.'),
});
export type ModerateCommunityPostOutput = z.infer<typeof ModerateCommunityPostOutputSchema>;


export async function moderateCommunityPost(input: ModerateCommunityPostInput): Promise<ModerateCommunityPostOutput> {
    return moderateCommunityPostFlow(input);
}

const moderateCommunityPostPrompt = ai.definePrompt({
  name: 'moderateCommunityPostPrompt',
  input: { schema: ModerateCommunityPostInputSchema },
  output: { schema: ModerateCommunityPostOutputSchema },
  prompt: `You are an AI moderator for a cybersecurity community forum. Your primary role is to ensure that discussions remain professional, on-topic, and free from any illegal or harmful content.

Analyze the following community post. Determine if it is appropriate. Content should be considered INAPPROPRIATE if it contains any of the following:
- Discussion or promotion of illegal activities (e.g., drug sales, hacking for malicious purposes).
- Use of slang or coded language related to illicit substances or criminal operations.
- Attempts to solicit or conduct transactions for illegal goods/services.
- Hate speech, harassment, or threats.
- Spam or irrelevant advertising.

If the content is inappropriate, set 'isAppropriate' to false and provide a brief reason. Otherwise, set 'isAppropriate' to true.

Post content to analyze:
"{{{text}}}"
`,
});

const moderateCommunityPostFlow = ai.defineFlow(
  {
    name: 'moderateCommunityPostFlow',
    inputSchema: ModerateCommunityPostInputSchema,
    outputSchema: ModerateCommunityPostOutputSchema,
  },
  async (input) => {
    // First, do a quick deterministic check for high-risk keywords.
    // This can quickly filter out obvious violations without needing an expensive AI call.
    const { high: highRiskKeywords, medium: mediumRiskKeywords } = await getSuspiciousKeywords();
    const lowerCaseText = input.text.toLowerCase();
    
    const allHarmfulKeywords = [...highRiskKeywords, ...mediumRiskKeywords];
    const foundKeyword = allHarmfulKeywords.find(kw => lowerCaseText.includes(kw));

    if (foundKeyword) {
      return {
        isAppropriate: false,
        reason: `Content flagged for containing the suspicious keyword: "${foundKeyword}".`,
      };
    }

    // If no obvious keywords are found, use the AI for a more nuanced analysis.
    const { output } = await moderateCommunityPostPrompt(input);
    return output!;
  }
);
