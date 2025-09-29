# **App Name**: Defenxia

## Core Features:

- URL Input: Allows the user to enter a URL for vulnerability scanning.
- Scan Initiation: Initiates the scanning process upon user action. Disables button during the scan to avoid resubmission.
- Tool Orchestration: Simulates sequential running of the tools.
- Scan Progress Simulation: Simulates real-time vulnerability scanning. Use a tool to determine if the tool will or will not include the piece of data during its report, indicating progress through animated console output.
- Report Generation: Generates a final report including a CVSS score distribution chart and a simulated vulnerability list after scanning is complete.
- Tool Status Animation: Provides animated feedback (pulsating/glowing) for active tools during the scan.

## Style Guidelines:

- Primary color: Vibrant orange (#FFA500) to create energy and signal the cyber security purpose of the app.
- Background color: Dark desaturated grey (#262A2E). It should create a futuristic theme with high readability, ensuring legibility without overpowering the primary elements.
- Accent color: Electric lime (#32CD32) as an analogous color to the primary one. It should be for active states, highlighting completion or important alerts.
- Headline font: 'Space Grotesk' sans-serif to align with a computerized, techy feel.
- Body font: 'Inter' sans-serif for a modern, machined and objective look.
- Futuristic icons with glowing effects for the tools (Nmap, Nikto, Nuclei, OpenVAS, Nessus) to align with a futuristic theme and show the different stages.
- Centrally-aligned container with rounded borders and glassmorphism effect to provide an elegant look.
- Progress bar animation with smooth transitions from 0% to 100% during the scan simulation. Pulsating effect on icons representing active tools.