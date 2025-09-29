'use client';

import { useState, useEffect } from 'react';
import type { Tool, ScanState, ReportData } from '@/types';
import { Card } from '@/components/ui/card';
import ControlPanel from './ControlPanel';
import VisualizationPanel from './VisualizationPanel';
import { useToast } from '@/hooks/use-toast';
import { simulateScanProgress } from '@/ai/flows/simulate-scan-progress';
import { Button } from '@/components/ui/button';
import { MessageCircle, Triangle, Square, Circle } from 'lucide-react';
import Chatbot from './Chatbot';
import { cn } from '@/lib/utils';


const initialTools: Tool[] = [
  { name: 'Nmap', status: 'inactive' },
  { name: 'Nikto', status: 'inactive' },
  { name: 'Nuclei', status: 'inactive' },
  { name: 'OpenVAS', status: 'inactive' },
  { name: 'Nessus', status: 'inactive' },
];

const mockReportData: ReportData = {
  cvssScores: [
    { name: 'Critical', value: 2 },
    { name: 'High', value: 5 },
    { name: 'Medium', value: 8 },
    { name: 'Low', value: 3 },
    { name: 'Info', value: 12 },
  ],
  vulnerabilities: [
    { title: 'Cross-Site Scripting (XSS)', severity: 'High' },
    { title: 'SQL Injection', severity: 'Critical' },
    { title: 'Outdated Server Software', severity: 'High' },
    { title: 'Missing Security Headers', severity: 'Medium' },
    { title: 'Directory Traversal', severity: 'Critical' },
    { title: 'Insecure Cookie Settings', severity: 'Medium' },
    { title: 'Verbose Server Banners', severity: 'Low' },
  ],
};

const Sparkles = ({ count = 20 }: { count?: number }) => {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: count }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }));
      setSparkles(newSparkles);
    };
    generateSparkles();
  }, [count]);

  return (
    <>
      {sparkles.map((style, i) => (
        <div key={i} className="sparkle" style={style} />
      ))}
    </>
  );
};

export default function DefenxiaPage() {
  const [url, setUrl] = useState<string>('https://example.com');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [currentToolIndex, setCurrentToolIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();

  const handleStartScan = async () => {
    if (url.trim() === '') {
      toast({
        title: 'URL is empty',
        description: 'Please enter a URL to start scanning.',
        variant: 'destructive',
      });
      return;
    }
    
    setScanState('scanning');
    setCurrentToolIndex(0);
    setProgress(0);
    setConsoleOutput([`Initiating scan for ${url}...`]);
    setTools(initialTools.map(t => ({ ...t, status: 'inactive' })));
    setReportData(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (scanState !== 'scanning' || currentToolIndex >= tools.length) {
      if (scanState === 'scanning' && currentToolIndex >= tools.length) {
        setConsoleOutput(prev => [...prev, 'Aggregating results and generating report...']);
        
        setTimeout(() => {
            setReportData(mockReportData);
            setConsoleOutput(prev => [...prev, 'Scan complete. Report generated.']);
            setTools(prev => prev.map(t => ({ ...t, status: 'completed' })));
            toast({
              title: 'Scan Finished',
              description: 'The vulnerability report is ready.',
            });
            setScanState('complete');
            setProgress(100);
        }, 1500); // Simulate report generation time
      }
      return () => clearTimeout(timer);
    }
    
    const progressPerTool = 100 / tools.length;

    setTools(prev => {
      const newTools = [...prev];
      if (currentToolIndex > 0) {
        newTools[currentToolIndex - 1].status = 'completed';
      }
      newTools[currentToolIndex].status = 'active';
      return newTools;
    });

    setProgress(prev => Math.min(100, (currentToolIndex + 1) * progressPerTool));
    
    const currentTool = tools[currentToolIndex];
    simulateScanProgress({ toolName: currentTool.name }).then(res => {
      setConsoleOutput(prev => [...prev, res.consoleOutput]);
    });

    const scanDuration = 1000 + Math.random() * 500;
    timer = setTimeout(() => {
      setCurrentToolIndex(prev => prev + 1);
    }, scanDuration);

    return () => clearTimeout(timer);
  }, [currentToolIndex, scanState, url]);

  return (
    <>
    <Card className="relative max-w-7xl w-full mx-auto bg-card/60 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden border border-white/20">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full aurora-bg pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles />
        {/* Layer 1 - Large, subtle shapes */}
        <Circle className="absolute h-96 w-96 text-destructive/10 -top-40 -left-40 shape-float" style={{ animationDelay: '0s', animationDuration: '15s' }} />
        <Square className="absolute h-80 w-80 text-destructive/10 -bottom-40 -right-20 shape-float" style={{ animationDelay: '2.5s', animationDuration: '18s' }} />
        <Triangle className="absolute h-72 w-72 text-gradient-end/10 top-1/2 left-1/3 shape-float" style={{ animationDelay: '5s', animationDuration: '20s' }} />
        
        {/* Layer 2 - Medium shapes */}
        <Square className="absolute h-56 w-56 text-destructive/15 bottom-1/4 right-1/4 shape-float" style={{ animationDelay: '1.5s', animationDuration: '12s' }} />
        <Triangle className="absolute h-48 w-48 text-gradient-end/15 top-20 right-1/2 shape-float" style={{ animationDelay: '4.5s', animationDuration: '14s' }} />
        <Circle className="absolute h-64 w-64 text-destructive/15 -bottom-32 right-1/2 shape-float" style={{ animationDelay: '7s', animationDuration: '16s' }} />

        {/* Layer 3 - Smaller, more visible shapes */}
        <Circle className="absolute h-32 w-32 text-gradient-end/25 top-10 left-10 shape-float" style={{ animationDelay: '0.5s', animationDuration: '8s' }} />
        <Square className="absolute h-24 w-24 text-destructive/20 bottom-1/2 right-1/3 shape-float" style={{ animationDelay: '3.5s', animationDuration: '9s' }} />
        <Triangle className="absolute h-40 w-40 text-gradient-end/25 top-1/4 left-3/4 shape-float" style={{ animationDelay: '6s', animationDuration: '10s' }} />
        <Circle className="absolute h-36 w-36 text-destructive/20 -bottom-10 left-1/3 shape-float" style={{ animationDelay: '8.5s', animationDuration: '11s' }} />

        {/* Layer 4 - Accent shapes */}
        <Square className="absolute h-16 w-16 text-destructive/40 -bottom-5 left-10 shape-float" style={{ animationDelay: '9.5s' }} />
        <Triangle className="absolute h-20 w-20 text-destructive/35 top-10 right-10 shape-float" style={{ animationDelay: '11s' }} />
        <Circle className="absolute h-12 w-12 text-destructive/40 bottom-20 right-1/2 shape-float" style={{ animationDelay: '12.5s' }} />

        {/* Layer 5 - Small, fast-moving "sparkles" */}
        <Circle className="absolute h-8 w-8 text-destructive/50 bottom-10 left-1/2 shape-float" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <Square className="absolute h-6 w-6 text-destructive/50 top-3/4 left-1/4 shape-float" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <Triangle className="absolute h-10 w-10 text-gradient-end/45 right-1/4 bottom-1/3 shape-float" style={{ animationDuration: '4.5s', animationDelay: '3s' }} />
        <Circle className="absolute h-10 w-10 text-destructive/40 top-1/3 left-1/4 shape-float" style={{ animationDuration: '5.5s', animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 p-4 md:p-8">
        <div className="lg:col-span-2">
          <ControlPanel
            url={url}
            setUrl={setUrl}
            isScanning={scanState === 'scanning'}
            onStartScan={handleStartScan}
            tools={tools}
          />
        </div>
        <div className="lg:col-span-3">
          <VisualizationPanel
            scanState={scanState}
            progress={progress}
            consoleOutput={consoleOutput}
            reportData={reportData}
          />
        </div>
      </div>
    </Card>
      <Button
        size="lg"
        className={cn(
          "fixed bottom-6 right-4 sm:right-8 md:right-12 z-40 rounded-full h-16 w-16 shadow-lg transition-opacity bg-gradient-to-r from-gradient-start to-gradient-end text-white",
          isChatOpen && "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsChatOpen(true)}
        title="Open AI Assistant"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} reportData={reportData} />}
    </>
  );
}
