'use server';

/**
 * @fileOverview Simulates the real-time progress of a vulnerability scan using animated console output.
 *
 * - simulateScanProgress - A function that simulates the scan progress.
 * - SimulateScanProgressInput - The input type for the simulateScanProgress function.
 * - SimulateScanProgressOutput - The return type for the simulateScanProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateScanProgressInputSchema = z.object({
  toolName: z.string().describe('The name of the tool being simulated.'),
});
export type SimulateScanProgressInput = z.infer<typeof SimulateScanProgressInputSchema>;

const SimulateScanProgressOutputSchema = z.object({
  consoleOutput: z.string().describe('The simulated console output for the tool.'),
  includeData: z.boolean().describe('Whether to include a specific piece of data in the output.'),
});
export type SimulateScanProgressOutput = z.infer<typeof SimulateScanProgressOutputSchema>;

export async function simulateScanProgress(input: SimulateScanProgressInput): Promise<SimulateScanProgressOutput> {
  return simulateScanProgressFlow(input);
}

const simulateScanProgressPrompt = ai.definePrompt({
  name: 'simulateScanProgressPrompt',
  input: {schema: SimulateScanProgressInputSchema},
  output: {schema: SimulateScanProgressOutputSchema},
  prompt: `You are simulating the console output of a cybersecurity vulnerability scanner tool named {{{toolName}}}.

  Generate a one-sentence console output message indicating the tool's current activity.

  Also, determine whether to include a specific piece of data in this output. This decision should be somewhat random to simulate real-time scanning and discovery.

  For example, if the tool is Nmap, the output could be "Nmap is running a SYN scan on the target URL."
  If the tool is Nikto, the output could be "Nikto is identifying potential vulnerabilities on the web server."
  If the tool is Nuclei, the output could be "Nuclei is scanning for common misconfigurations."

  The includeData field should be set to true or false to indicate whether the simulated output should include a specific finding or detail. This will add an element of randomness and realism to the simulated scan.

  Make sure that the consoleOutput and includeData fields are populated.
  `,
});

const simulateScanProgressFlow = ai.defineFlow(
  {
    name: 'simulateScanProgressFlow',
    inputSchema: SimulateScanProgressInputSchema,
    outputSchema: SimulateScanProgressOutputSchema,
  },
  async input => {
    try {
      const {output} = await simulateScanProgressPrompt(input);
      return output!;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in simulateScanProgressFlow:`, error);
      // Fallback to a default response if the AI call fails
      return {
        consoleOutput: `Running ${input.toolName} scan... (fallback)`,
        includeData: Math.random() < 0.2, // 20% chance to include data on fallback
      };
    }
  }
);
