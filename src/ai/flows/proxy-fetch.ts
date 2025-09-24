
'use server';

/**
 * @fileOverview A Genkit flow that acts as a server-side proxy to fetch URL content, bypassing client-side CORS issues.
 *
 * - proxyFetch - A function that fetches content from a given URL.
 * - ProxyFetchInput - The input type for the proxyFetch function.
 * - ProxyFetchOutput - The return type for the proxyFetch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProxyFetchInputSchema = z.object({
  url: z.string().url().describe('The URL to fetch.'),
});
export type ProxyFetchInput = z.infer<typeof ProxyFetchInputSchema>;

const ProxyFetchOutputSchema = z.object({
  content: z.string().describe('The HTML content of the page.'),
  error: z.string().optional().describe('An error message if fetching failed.'),
});
export type ProxyFetchOutput = z.infer<typeof ProxyFetchOutputSchema>;

export async function proxyFetch(input: ProxyFetchInput): Promise<ProxyFetchOutput> {
  return proxyFetchFlow(input);
}

const proxyFetchFlow = ai.defineFlow(
  {
    name: 'proxyFetchFlow',
    inputSchema: ProxyFetchInputSchema,
    outputSchema: ProxyFetchOutputSchema,
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          // Some sites block requests without a user-agent, so we mimic a common browser.
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        // This will provide a more specific error message on the client-side.
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      return { content };
    } catch (e: any) {
      console.error(`[Proxy Fetch Error] for ${url}:`, e);
      return {
        content: '',
        error: e.message || 'An unknown error occurred while fetching the URL.',
      };
    }
  }
);
