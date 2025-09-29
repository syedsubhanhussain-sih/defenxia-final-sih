export type ToolStatus = 'inactive' | 'active' | 'completed';

export type Tool = {
  name: string;
  status: ToolStatus;
};

export type ScanState = 'idle' | 'scanning' | 'complete';

export type VulnerabilitySeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export type CvssScore = { 
  name: string; 
  value: number;
}

export type Vulnerability = {
  title: string;
  severity: VulnerabilitySeverity;
}

export type ReportData = {
  cvssScores: CvssScore[];
  vulnerabilities: Vulnerability[];
};
