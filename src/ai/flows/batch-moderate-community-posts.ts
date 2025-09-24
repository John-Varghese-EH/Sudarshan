'use server';
/**
 * @fileOverview A Genkit flow for moderating a batch of community posts.
 *
 * - batchModerateCommunityPosts - A function that analyzes an array of post texts.
 * - BatchModerateCommunityPostsInput - The input type for the function.
 * - BatchModerateCommunityPostsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PostToModerateSchema = z.object({
    id: z.string().describe('The unique identifier for the post.'),
    text: z.string().describe('The text content of the community post.'),
});

const ModerationResultSchema = z.object({
    id: z.string().describe('The unique identifier for the post.'),
    isAppropriate: z.boolean().describe('Whether the content is appropriate for a public community forum.'),
    reason: z.string().optional().describe('The reason for flagging the content, if applicable.'),
});

const BatchModerateCommunityPostsInputSchema = z.object({
  posts: z.array(PostToModerateSchema).describe('An array of posts to moderate.'),
});
export type BatchModerateCommunityPostsInput = z.infer<typeof BatchModerateCommunityPostsInputSchema>;

const BatchModerateCommunityPostsOutputSchema = z.object({
    results: z.array(ModerationResultSchema).describe('An array of moderation results corresponding to the input posts.'),
});
export type BatchModerateCommunityPostsOutput = z.infer<typeof BatchModerateCommunityPostsOutputSchema>;

export async function batchModerateCommunityPosts(input: BatchModerateCommunityPostsInput): Promise<BatchModerateCommunityPostsOutput> {
    return batchModerateCommunityPostsFlow(input);
}

const batchModerateCommunityPostsPrompt = ai.definePrompt({
    name: 'batchModerateCommunityPostsPrompt',
    input: { schema: BatchModerateCommunityPostsInputSchema },
    output: { schema: BatchModerateCommunityPostsOutputSchema },
    prompt: `You are an AI moderator for a cybersecurity community forum. Your primary role is to ensure that discussions remain professional, on-topic, and free from any illegal or harmful content.

Analyze the following list of community posts. For each post, determine if it is appropriate. Content should be considered INAPPROPRIATE if it contains any of the following:
- Discussion or promotion of illegal activities (e.g., drug sales, hacking for malicious purposes).
- Use of slang or coded language related to illicit substances or criminal operations.
- Attempts to solicit or conduct transactions for illegal goods/services.
- Hate speech, harassment, or threats.
- Spam or irrelevant advertising.

For each post, provide its original ID, set 'isAppropriate' to false if it's inappropriate and provide a brief reason, otherwise set 'isAppropriate' to true.

Posts to analyze:
{{#each posts}}
---
ID: {{{id}}}
Content: "{{{text}}}"
---
{{/each}}
`,
});

const batchModerateCommunityPostsFlow = ai.defineFlow(
    {
        name: 'batchModerateCommunityPostsFlow',
        inputSchema: BatchModerateCommunityPostsInputSchema,
        outputSchema: BatchModerateCommunityPostsOutputSchema,
    },
    async (input) => {
        if (input.posts.length === 0) {
            return { results: [] };
        }
        const { output } = await batchModerateCommunityPostsPrompt(input);
        return output!;
    }
);
