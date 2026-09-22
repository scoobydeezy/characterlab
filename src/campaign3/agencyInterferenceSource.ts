/** agency-interference-source/0.1-candidate; pure kernel, not public persistence. */
export const AGENCY_SOURCE_VERSION = 'agency-interference-source/0.1-candidate';
export type Observer = 'A' | 'B';
export type Blocker = 'blocker-a' | 'blocker-b';
export type Access = Readonly<{ outcome: boolean; obstruction: boolean }>;
export type AttemptInput = Readonly<{
  attempt: number; frozenIntent: 'deliver'; competent: boolean; blocker: Blocker | null;
  access: Readonly<Record<Observer, Access>>;
}>;
export type Observation = Readonly<{
  observer: Observer; episode: string;
} & ({ kind: 'outcome'; success: boolean }
  | { kind: 'obstruction'; actor: string; source: string }
  | { kind: 'report'; positive: boolean; source: string })>;
export type Report = Readonly<{
  receipt: number; attempt: number; positive: boolean; recipients: readonly Observer[];
}>;
export type Evidence = Readonly<{
  episode: string; source: string; kind: 'obstruction' | 'report'; positive: boolean;
  actor?: string;
}>;
const observers: readonly Observer[] = ['A', 'B'];
function observer(value: Observer) {
  if (!observers.includes(value)) throw Error('AGENCY_OBSERVER');
}
function bounded(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 8) throw Error('AGENCY_ID');
}
function bool(value: boolean) { if (typeof value !== 'boolean') throw Error('AGENCY_BOOLEAN'); }
const episode = (who: Observer, attempt: number) => `${who}/visible-episode/${attempt}`;

export function projectAttempt(input: AttemptInput) {
  bounded(input.attempt); bool(input.competent);
  if (input.frozenIntent !== 'deliver') throw Error('AGENCY_INTENT');
  if (input.blocker !== null && input.blocker !== 'blocker-a' && input.blocker !== 'blocker-b') throw Error('AGENCY_BLOCKER');
  const success = input.blocker === null && input.competent;
  const views: Record<Observer, Observation[]> = { A: [], B: [] };
  for (const who of observers) {
    const access = input.access[who]; bool(access.outcome); bool(access.obstruction);
    const common = { observer: who, episode: episode(who, input.attempt) };
    if (access.outcome) views[who].push({ ...common, kind: 'outcome', success });
    if (access.obstruction && input.blocker !== null) views[who].push({ ...common,
      kind: 'obstruction', actor: `${who}/identified/${input.blocker}`,
      source: `${common.episode}/visible-block` });
  }
  return { truth: { attempt: input.attempt, competent: input.competent, blocker: input.blocker,
    intent: input.frozenIntent, attempted: input.frozenIntent, success }, views };
}

/** Validate the complete controlled statement roster before projecting any report. */
export function projectReports(reports: readonly Report[]): Record<Observer, Observation[]> {
  if (reports.length > 8) throw Error('AGENCY_REPORT_LIMIT');
  const seen = new Map<number, string>();
  for (const report of reports) {
    bounded(report.attempt); bounded(report.receipt); bool(report.positive);
    report.recipients.forEach(observer);
    if (new Set(report.recipients).size !== report.recipients.length) throw Error('AGENCY_RECIPIENTS');
    const claim = `${report.attempt}/${report.positive}`;
    if (seen.has(report.receipt) && seen.get(report.receipt) !== claim) throw Error('AGENCY_RECEIPT_CONFLICT');
    seen.set(report.receipt, claim);
  }
  const views: Record<Observer, Observation[]> = { A: [], B: [] };
  for (const report of reports) for (const who of report.recipients) views[who].push({
    observer: who, episode: episode(who, report.attempt), kind: 'report',
    positive: report.positive, source: `${who}/visible-receipt/${report.receipt}`,
  });
  return views;
}

export function admitAgencyEvidence(who: Observer, observations: readonly Observation[], outcomeOnly = false): Evidence[] {
  observer(who);
  return observations.flatMap(item => {
    if (item.observer !== who) throw Error('AGENCY_FOREIGN_OBSERVATION');
    if (outcomeOnly || item.kind === 'outcome') return [];
    return [{ episode: item.episode, source: item.source, kind: item.kind,
      positive: item.kind === 'obstruction' ? true : item.positive,
      ...(item.kind === 'obstruction' ? { actor: item.actor } : {}) }];
  });
}

/** Exact diagnostic fractions; the caller supplies only admitted evidence. */
export function foldAgencyEvidence(evidence: readonly Evidence[], law: 'GroupedMean' | 'LastClaim') {
  if (law !== 'GroupedMean' && law !== 'LastClaim') throw Error('AGENCY_LAW');
  const states = new Map<string, { numerator: number; denominator: number; support: Evidence[] }>();
  for (const item of evidence) {
    const state = states.get(item.episode) ?? { numerator: 0, denominator: 0, support: [] };
    const prior = state.support.find(e => e.source === item.source);
    if (prior) {
      if (prior.positive !== item.positive || prior.kind !== item.kind || prior.actor !== item.actor) throw Error('AGENCY_EVIDENCE_CONFLICT');
      continue;
    }
    state.support.push({ ...item });
    state.numerator = law === 'LastClaim' ? Number(item.positive) : state.numerator + Number(item.positive);
    state.denominator = law === 'LastClaim' ? 1 : state.support.length;
    states.set(item.episode, state);
  }
  return states;
}
