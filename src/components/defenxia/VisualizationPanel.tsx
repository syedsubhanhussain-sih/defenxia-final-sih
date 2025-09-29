import type { ScanState, ReportData } from '@/types';
import InitialState from './InitialState';
import ScanningState from './ScanningState';
import ReportState from './ReportState';
import { Card } from '@/components/ui/card';

interface VisualizationPanelProps {
  scanState: ScanState;
  progress: number;
  consoleOutput: string[];
  reportData: ReportData | null;
}

export default function VisualizationPanel({
  scanState,
  progress,
  consoleOutput,
  reportData,
}: VisualizationPanelProps) {
  return (
    <Card className="h-full w-full bg-card/10 backdrop-blur-lg p-6 rounded-xl flex flex-col justify-center items-center min-h-[400px] md:min-h-full border-white/20">
      {scanState === 'idle' && <InitialState />}
      {scanState === 'scanning' && (
        <ScanningState progress={progress} consoleOutput={consoleOutput} />
      )}
      {scanState === 'complete' && reportData && (
        <ReportState reportData={reportData} />
      )}
    </Card>
  );
}
