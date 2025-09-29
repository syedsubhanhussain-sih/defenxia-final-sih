import type { ReportData, VulnerabilitySeverity } from '@/types';
import CvssChart from './CvssChart';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function getBadgeVariant(severity: VulnerabilitySeverity): 'destructive' | 'primary' | 'secondary' | 'default' | 'outline' {
    switch (severity) {
        case 'Critical': return 'destructive';
        case 'High': return 'primary';
        case 'Medium': return 'secondary';
        default: return 'outline';
    }
}

export default function ReportState({ reportData }: { reportData: ReportData }) {
  return (
    <div className="w-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-headline font-bold">Scan Report</h3>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div>
        <h4 className="text-lg font-headline mb-2">CVSS Score Distribution</h4>
        <div className="h-48 w-full">
          <CvssChart data={reportData.cvssScores} />
        </div>
      </div>

      <div>
        <h4 className="text-lg font-headline mb-2">Vulnerabilities Found</h4>
        <ScrollArea className="h-48 w-full rounded-md border">
          <ul className="p-2">
            {reportData.vulnerabilities.map((vuln, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-black/5">
                <span className="text-sm text-foreground/80">{vuln.title}</span>
                <Badge variant={getBadgeVariant(vuln.severity)} className="w-24 justify-center">{vuln.severity}</Badge>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}
