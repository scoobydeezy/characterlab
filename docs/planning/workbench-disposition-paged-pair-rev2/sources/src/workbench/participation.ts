import type {TimelineEvent} from './contracts';
export const PARTICIPATION_VERSION = 'recorded-state-participation/0.1';
export interface ParticipationRow {
  path: string; root: string | null; label: string;
  reads: number; mutations: number; changes: number; presentAtRevision: boolean;
  events: {id: string; instant: string; stage: string; reads: number; mutations: number; changes: number}[];
}
/** A trace census, not a model topology or causal-effect estimator. */
export function stateParticipation(timeline: readonly TimelineEvent[], fields: readonly {path: string; root: string}[]): ParticipationRow[] {
  const rows = new Map<string, ParticipationRow>();
  const ensure = (path: string, label = path) => {
    let row = rows.get(path);
    if (!row) {row = {path, root: null, label, reads: 0, mutations: 0, changes: 0, presentAtRevision: false, events: []}; rows.set(path,row);}
    return row;
  };
  for (const field of fields) {const row = ensure(field.path); row.root = field.root; row.presentAtRevision = true;}
  const ids = new Set<string>();
  for (const event of timeline) {
    if (ids.has(event.id)) throw Error('Duplicate event identity in participation prefix');
    ids.add(event.id);
    const activity = new Map<string, {reads: number; mutations: number; changes: number}>();
    const touch = (path: string, label: string) => {ensure(path).label = label; let counts = activity.get(path); if (!counts) {counts = {reads:0,mutations:0,changes:0}; activity.set(path,counts);} return counts;};
    for (const read of event.reads) touch(read.path, read.label).reads++;
    for (const diff of event.diffs) {const counts = touch(diff.path,diff.label); counts.mutations++; if (diff.changed) counts.changes++;}
    for (const [path, counts] of activity) {const row = ensure(path); row.reads += counts.reads; row.mutations += counts.mutations; row.changes += counts.changes; row.events.push({id:event.id, instant:event.instant, stage:event.stage, ...counts});}
  }
  return [...rows.values()].sort((a,b)=>a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
export function participationReport(identity: {modelHash: string; runHash: string; saveHash: string; stateHash: string; prefix: number}, timeline: readonly TimelineEvent[], fields: readonly {path: string; root: string}[]) {
  return {version: PARTICIPATION_VERSION, identity: {...identity}, events: timeline.length, rows: stateParticipation(timeline,fields),
    scope: {authority:'Derived diagnostic', source:'trace/0.2-candidate actual reads and structural mutation diffs', horizon:'Selected committed prefix only', persistence:'Presence at the selected revision; not retention throughout history', causalContribution:'Not established; no intervention/evaluation contribution evidence joined', coverage:'Payload dependencies, uninstrumented accesses and canonical subsystem mapping not established', zero:'No recorded activity in this prefix; never a removal recommendation'}};
}
