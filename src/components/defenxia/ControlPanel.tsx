import type { Tool } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolStatusList from './ToolStatusList';
import { Label } from '@/components/ui/label';

interface ControlPanelProps {
  url: string;
  setUrl: (url: string) => void;
  isScanning: boolean;
  onStartScan: () => void;
  tools: Tool[];
}

export default function ControlPanel({
  url,
  setUrl,
  isScanning,
  onStartScan,
  tools,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col h-full space-y-8">
      <header>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
          Defenxia
        </h1>
        <p className="text-muted-foreground mt-1 font-headline">Where Code Meets Security</p>
      </header>

      <div className="space-y-4">
        <p className="text-sm text-foreground/80">The intelligent scanner that adapts to tomorrow&apos;s threats.</p>
        
        <div className="space-y-2">
            <Label htmlFor="url">Target URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={isScanning}
              className="bg-white placeholder:text-muted-foreground/60 h-12 text-base"
            />
        </div>

        <Button
          onClick={onStartScan}
          disabled={isScanning}
          className="w-full h-12 text-base font-bold"
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </div>
      
      <div className="flex-grow">
        <h2 className="text-lg font-headline font-semibold mb-4">Tools</h2>
        <ToolStatusList tools={tools} />
      </div>
    </div>
  );
}
