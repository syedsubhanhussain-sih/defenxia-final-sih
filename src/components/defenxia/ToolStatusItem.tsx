import type { Tool } from '@/types';
import { cn } from '@/lib/utils';
import {
  ScanLine,
  Server,
  FileCode,
  ShieldCheck,
  Bug,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Nmap: ScanLine,
  Nikto: Server,
  Nuclei: FileCode,
  OpenVAS: ShieldCheck,
  Nessus: Bug,
};

export default function ToolStatusItem({ tool }: { tool: Tool }) {
  const Icon = iconMap[tool.name] || ShieldAlert;

  const isCompleted = tool.status === 'completed';
  const isActive = tool.status === 'active';

  return (
    <div
      className={cn(
        'flex items-center justify-center text-center gap-3 rounded-lg p-3 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 h-24 flex-col',
        isActive
          ? 'bg-gradient-to-r from-gradient-start to-gradient-end text-primary-foreground animate-pulse-glow'
          : 'bg-card/60 text-foreground/80 border',
        isCompleted ? 'bg-accent/30 text-accent-foreground border-accent' : 'border-border'
      )}
    >
      <div className="relative">
      {isCompleted ? (
        <CheckCircle2 className="h-6 w-6 shrink-0 text-accent" />
      ) : (
        <Icon
          className={cn(
            'h-6 w-6 shrink-0',
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        />
      )}
      </div>
      <span
        className={cn(
          'text-sm font-medium truncate',
          isActive ? 'text-primary-foreground' : '',
          isCompleted ? 'text-accent-foreground' : ''
        )}
      >
        {tool.name}
      </span>
    </div>
  );
}
