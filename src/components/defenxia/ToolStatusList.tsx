import type { Tool } from '@/types';
import ToolStatusItem from './ToolStatusItem';

interface ToolStatusListProps {
  tools: Tool[];
}

export default function ToolStatusList({ tools }: ToolStatusListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {tools.map((tool, index) => (
        <div key={`${tool.name}-${index}`}>
          <ToolStatusItem tool={tool} />
        </div>
      ))}
    </div>
  );
}
