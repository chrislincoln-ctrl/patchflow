// Core type definitions for PatchFlow

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'pending' | 'running' | 'complete' | 'failed' | 'blocked';
export type EvidenceType = 'pdf' | 'log' | 'code' | 'test' | 'document' | 'spec';
export type InvestigatorRole = 'code' | 'log' | 'test' | 'documentation';
export type DemoPhase =
  | 'idle'
  | 'ingesting'
  | 'spawning'
  | 'investigating'
  | 'synthesizing'
  | 'reproducing'
  | 'patching'
  | 'testing'
  | 'validating'
  | 'reporting'
  | 'complete';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: string;
  repository: string;
  detectedAt: string;
  reporter: string;
  affectedEndpoint: string;
  errorCode: string;
  impactedUsers: number;
}

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  source: string;
  relevantLines?: string;
  finding: string;
  usedBy: InvestigatorRole[];
  content?: string;
}

export interface InvestigatorFinding {
  id: string;
  role: InvestigatorRole;
  label: string;
  icon: string;
  status: Status;
  elapsedTime: string;
  filesReviewed: number;
  relevantFiles: number;
  finding: string;
  evidenceRefs: string[];
  details: string;
  confidence: number;
}

export interface RootCause {
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  affectedFiles: AffectedFile[];
  evidenceChain: EvidenceChainStep[];
  whyBelieve: string[];
}

export interface AffectedFile {
  path: string;
  role: string;
  linesAffected: string;
}

export interface EvidenceChainStep {
  label: string;
  description: string;
  type: 'incident' | 'symptom' | 'codepath' | 'rule' | 'cause';
}

export interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'header';
  content: string;
  lineNo?: number;
}

export interface PatchFile {
  path: string;
  linesAdded: number;
  linesRemoved: number;
  diff: DiffLine[];
}

export interface Patch {
  summary: string;
  description: string;
  files: PatchFile[];
  regressionTest: RegressionTest;
  unrelatedFilesTouched: number;
  safetyAssessment: string;
}

export interface RegressionTest {
  filename: string;
  content: string;
  testCount: number;
  description: string;
}

export interface ValidationCheck {
  id: string;
  label: string;
  description: string;
  status: Status;
  detail: string;
  icon: string;
}

export interface ValidationResult {
  status: 'verified' | 'blocked' | 'pending';
  checks: ValidationCheck[];
  summary: string;
  totalTests: number;
  passedTests: number;
}

export interface ImpactMetric {
  id: string;
  label: string;
  before: number;
  after: number;
  unit: string;
  lowerIsBetter: boolean;
  note?: string;
}

export interface ImpactData {
  disclaimer: string;
  metrics: ImpactMetric[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'evidence' | 'investigator' | 'synthesis' | 'output';
  status: Status;
  evidenceId?: string;
  investigatorId?: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  animated?: boolean;
}
