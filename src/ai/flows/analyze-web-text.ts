
'use server';

/**
 * @fileOverview A Genkit flow for analyzing web text for suspicious keywords.
 *
 * - analyzeWebText - A function that handles the analysis of a URL or raw text.
 * - AnalyzeWebTextInput - The input type for the analyzeWebText function.
 * - AnalyzeWebTextOutput - The return type for the analyzeWebText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ScanKeyword } from '@/lib/keyword-service';


const AnalyzeWebTextInputSchema = z.object({
  text: z.string().describe("Raw text/HTML content to scan."),
  scanKeywords: z.array(z.object({
    word: z.string(),
    weight: z.number(),
    category: z.string(),
  })).describe("Keywords to scan for."),
});
export type AnalyzeWebTextInput = z.infer<typeof AnalyzeWebTextInputSchema>;

const DetectedKeywordSchema = z.object({
  word: z.string().describe("The detected keyword."),
  category: z.string().describe("The category of the keyword (e.g., 'finance', 'gambling')."),
  weight: z.number().describe("The risk weight of the keyword."),
  count: z.number().describe("How many times the keyword appeared."),
  context: z.array(z.string()).describe("Snippets of text where the keyword was found."),
});

const AnalyzeWebTextOutputSchema = z.object({
  detectedKeywords: z.array(DetectedKeywordSchema).describe("A list of keywords found in the text."),
  totalOccurrences: z.number().describe("The total count of all keyword occurrences."),
  riskLevel: z.enum(['low', 'medium', 'high']).describe("The calculated risk level based on keywords."),
});
export type AnalyzeWebTextOutput = z.infer<typeof AnalyzeWebTextOutputSchema>;

export async function analyzeWebText(input: AnalyzeWebTextInput): Promise<AnalyzeWebTextOutput> {
    return analyzeWebTextFlow(input);
}

const analyzeWebTextFlow = ai.defineFlow(
  {
    name: 'analyzeWebTextFlow',
    inputSchema: AnalyzeWebTextInputSchema,
    outputSchema: AnalyzeWebTextOutputSchema,
  },
  async (input) => {
    const contentToAnalyze = input.text;
    const keywords = input.scanKeywords;
    const lowerCaseContent = contentToAnalyze.toLowerCase();
    
    // Split content into sentences for better context gathering.
    const sentences = contentToAnalyze.match(/[^.!?]+[.!?\n]+/g) || [contentToAnalyze];

    let totalScore = 0;
    let totalOccurrences = 0;

    const detectedKeywords = keywords
        .map(keyword => {
            const lowerCaseWord = keyword.word.toLowerCase();
            const regex = new RegExp(`\\b${lowerCaseWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            
            const matches = lowerCaseContent.match(regex);
            const count = matches ? matches.length : 0;
            const context: string[] = [];

            if (count > 0) {
              sentences.forEach(sentence => {
                  if (sentence.toLowerCase().includes(lowerCaseWord)) {
                      const trimmedSentence = sentence.trim();
                      if (!context.includes(trimmedSentence)) {
                          context.push(trimmedSentence);
                      }
                  }
              });
            }

            return { ...keyword, count, context };
        })
        .filter(kw => kw.count > 0);

    detectedKeywords.forEach(kw => {
        totalScore += kw.weight * kw.count;
        totalOccurrences += kw.count;
    });

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (totalScore >= 100) {
        riskLevel = 'high';
    } else if (totalScore >= 50) {
        riskLevel = 'medium';
    }

    return {
        detectedKeywords,
        totalOccurrences,
        riskLevel,
    };
  }
);
