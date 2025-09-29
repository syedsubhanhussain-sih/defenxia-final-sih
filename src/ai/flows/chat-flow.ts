'use server';

/**
 * @fileOverview A simple AI chatbot flow that can answer questions about a security report.
 *
 * - chatWithReport - A function that handles the chat interaction.
 * - ChatWithReportInput - The input type for the chatWithReport function.
 * - ChatWithReportOutput - The return type for the chatWithReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithReportInputSchema = z.object({
  userQuery: z.string().describe("The user's message to the chatbot."),
  reportData: z
    .string()
    .describe('A JSON string of the report data. Can be an empty object.'),
});
export type ChatWithReportInput = z.infer<typeof ChatWithReportInputSchema>;

const ChatWithReportOutputSchema = z.object({
  response: z
    .string()
    .describe("The chatbot's response to the user's query."),
});
export type ChatWithReportOutput = z.infer<typeof ChatWithReportOutputSchema>;

export async function chatWithReport(
  input: ChatWithReportInput
): Promise<ChatWithReportOutput> {
  // Directly handle the case where the user asks for the report but it's not ready.
  if (input.userQuery.toLowerCase().includes('report') && (input.reportData === 'null' || !input.reportData)) {
    return {
      response: "You need to run a scan first to see the report. Please start a scan and then ask me again.",
    };
  }
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatWithReportInputSchema },
  output: { schema: ChatWithReportOutputSchema },
  prompt: `You are a helpful cybersecurity assistant called Defenxia AI.

Your task is to answer the user's questions. Be concise and helpful. You can answer general questions about cybersecurity or about your purpose.

If the user asks for a summary of the report, and the reportData is available, provide a brief, easy-to-understand summary of the key findings from the JSON data. Do not just repeat the JSON.

Report Data (if available):
{{{reportData}}}

User Query: {{{userQuery}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatWithReportInputSchema,
    outputSchema: ChatWithReportOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await chatPrompt(input);
      return output!;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in chatFlow:`, error);
      return {
        response:
          "Sorry, I'm having trouble connecting to the AI service right now. Please try again in a few moments.",
      };
    }
  }
);
