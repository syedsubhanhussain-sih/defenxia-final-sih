'use server';

/**
 * @fileOverview A flow that interacts with the VirusTotal API to analyze a URL.
 *
 * - analyzeUrlWithVirusTotal - A function that fetches a URL report from VirusTotal and summarizes it.
 * - AnalyzeUrlInput - The input type for the analyzeUrlWithVirusTotal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ReportData } from '@/types';

// Define Zod schemas for input and the expected raw VirusTotal API response structure.
const AnalyzeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to analyze.'),
  apiKey: z.string().describe('The VirusTotal API key.'),
});
export type AnalyzeUrlInput = z.infer<typeof AnalyzeUrlInputSchema>;

const VirusTotalAnalysisResultSchema = z.object({
  malicious: z.number().optional(),
  suspicious: z.number().optional(),
  harmless: z.number().optional(),
  undetected: z.number().optional(),
});

const VirusTotalUrlReportSchema = z.object({
  data: z.object({
    attributes: z.object({
      last_analysis_stats: VirusTotalAnalysisResultSchema,
      last_analysis_results: z.record(z.object({
        category: z.string(),
        result: z.string(),
        method: z.string(),
        engine_name: z.string(),
      })).optional(),
    }),
  }).optional(),
  error: z.object({
      code: z.string(),
      message: z.string()
  }).optional()
});

// The main exported function that clients will call.
export async function analyzeUrlWithVirusTotal(input: AnalyzeUrlInput): Promise<ReportData> {
  return virusTotalFlow(input);
}

// Define the Genkit prompt for summarizing the VirusTotal report.
const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeVirusTotalReport',
  input: { schema: z.object({ rawReport: z.string() }) },
  output: { schema: z.custom<ReportData>() },
  prompt: `
    You are a cybersecurity analyst. Your task is to interpret a raw JSON report from VirusTotal for a URL scan and format it into a structured ReportData object.

    The user is not a security expert, so convert the findings into clear, understandable vulnerability titles and severity levels (Critical, High, Medium, Low, Info).

    Based on the 'last_analysis_stats', create the 'cvssScores' array.
    - 'malicious' maps to 'Critical'.
    - 'suspicious' maps to 'High'.
    - Other non-zero stats can be 'Medium' or 'Low'. Sum up harmless and undetected for 'Info'.

    Based on the 'last_analysis_results', create the 'vulnerabilities' list.
    - If a result is 'malicious' or 'phishing', classify it as 'Critical' or 'High'.
    - If a result is 'suspicious', classify it as 'Medium'.
    - If a result is 'unrated' or 'harmless', classify it as 'Info'.

    Do not invent vulnerabilities. Only use data present in the report. If the report is clean, return empty arrays for scores and vulnerabilities.

    Raw VirusTotal JSON:
    {{{rawReport}}}
  `,
});

// Define the main Genkit flow.
const virusTotalFlow = ai.defineFlow(
  {
    name: 'virusTotalFlow',
    inputSchema: AnalyzeUrlInputSchema,
    outputSchema: z.custom<ReportData>(),
  },
  async ({ url, apiKey }) => {
    // 1. Get the URL ID from VirusTotal
    const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
    const reportUrl = `https://www.virustotal.com/api/v3/urls/${urlId}`;
    
    // 2. Fetch the report from the VirusTotal API
    const response = await fetch(reportUrl, {
      headers: {
        'x-apikey': apiKey,
      },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        const errorMessage = errorBody.error?.message || response.statusText;
        console.error('VirusTotal API Error:', errorMessage, 'Status:', response.status);
        throw new Error(`VirusTotal API request failed: ${errorMessage}`, { cause: errorBody });
    }

    const rawReport = await response.json();

    // 3. Validate the received report structure
    const parsedReport = VirusTotalUrlReportSchema.safeParse(rawReport);

    if (!parsedReport.success || !parsedReport.data.data) {
        console.error("Failed to parse VirusTotal report:", parsedReport.error);
        throw new Error('Received an invalid report format from VirusTotal.');
    }
    
    if(parsedReport.data.error) {
        throw new Error(`VirusTotal API returned an error: ${parsedReport.data.error.message}`);
    }

    // 4. Use AI to summarize the report into the desired format
    const { output } = await summarizeReportPrompt({
      rawReport: JSON.stringify(parsedReport.data),
    });

    if (!output) {
      throw new Error('The AI failed to generate a summary of the VirusTotal report.');
    }

    return output;
  }
);
