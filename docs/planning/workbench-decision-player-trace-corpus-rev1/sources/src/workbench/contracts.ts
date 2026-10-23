/** Detached presentation contracts; never part of ModelIdentity or Save132. */
export const WORKBENCH_VERSION = 'workbench/0.1';
export const SEMANTIC_VERSION = 'values-workbench-semantics/0.1';
export type EpistemicScope = 'World truth' | 'Character evidence' | 'Character state' | 'Diagnostic';
export type AuthorityKind = 'Runtime' | 'Derived' | 'Evaluation' | 'Historical' | 'Diagnostic';
export interface DiagnosticField {
  key: string;
  label: string;
  group: string;
  exact: string;
  authority: AuthorityKind;
  scope: EpistemicScope;
  revision: string;
  editPolicy: 'Read only';
}
export interface TransitionDiff {path: string; label: string; before: string; after: string; changed: boolean;}
export interface TimelineEvent {
  id: string;
  instant: string;
  phase: string;
  stage: string;
  parents: string[];
  reads: {path: string; label: string; exact: string}[];
  diffs: TransitionDiff[];
  input: string;
  output: string;
  draws: string;
  quantization: string;
}
export interface ReasonExplanation {
  id: string;
  eventId: string;
  instant: number;
  option: string;
  concept: string;
  polarity: 'Supports' | 'Opposes';
  human: string;
  renderer: string;
  raw: string;
  calibrated: string;
  die: string;
  modifiers: string;
  uncertainty: string;
  provenance: string;
  semanticKey: string;
}
export interface Activity {
  root: string;
  label: string;
  reads: number;
  writes: number;
  changes: number;
  persisted: boolean;
  contribution: 'Not established by read/change instrumentation';
}
