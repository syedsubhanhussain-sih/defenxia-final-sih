import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface ScanningStateProps {
  progress: number;
  consoleOutput: string[];
}

export default function ScanningState({
  progress,
  consoleOutput,
}: ScanningStateProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [consoleOutput]);

  return (
    <div className="w-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <h3 className="text-xl font-headline text-center">Scan in Progress...</h3>
      <Progress value={progress} className="w-full" />
      <ScrollArea className="h-64 w-full rounded-md border bg-muted/30 p-4 font-code text-sm">
        <div ref={scrollAreaRef}>
        {consoleOutput.map((line, index) => (
          <p key={index} className="flex items-start">
            <span className="text-primary mr-2">{'>'}</span>
            <span className="flex-1">{line}</span>
          </p>
        ))}
        </div>
      </ScrollArea>
    </div>
  );
}
