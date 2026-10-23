import {PARTICIPATION_VERSION, participationReport} from './participation';
export type ParticipationReport = ReturnType<typeof participationReport>;
export interface AuditMember {name: string; seamVersion: string; report: ParticipationReport;}
export const COHORT_VERSION = 'participation-cohort/0.1';
export const COHORT_LIMITS = {runs:64, rowsPerRun:10000} as const;
/** One explicitly selected prefix per run. No cross-model semantic equivalence is inferred. */
export function aggregateParticipation(input: readonly AuditMember[]) {
  if (input.length > COHORT_LIMITS.runs) throw Error('Audit cohort exceeds 64 runs');
  const members = structuredClone(input), runIds = new Set<string>();
  for (const member of members) {
    const {report} = member;
    if (!member.name || !member.seamVersion || report.version !== PARTICIPATION_VERSION || !report.identity.runHash || !report.identity.modelHash) throw Error('Invalid audit identity/version');
    if (runIds.has(report.identity.runHash)) throw Error('Select one prefix per run; duplicate run identity would double-count cumulative history');
    runIds.add(report.identity.runHash);
    if (report.rows.length > COHORT_LIMITS.rowsPerRun || new Set(report.rows.map(r=>r.path)).size !== report.rows.length) throw Error('Invalid bounded audit path roster');
    for (const row of report.rows) {
      if (![row.reads,row.mutations,row.changes].every(n=>Number.isSafeInteger(n)&&n>=0) || row.changes>row.mutations) throw Error('Invalid audit counts');
    }
  }
  const groups = new Map<string, {seamVersion:string; modelHash:string; members:AuditMember[]}>();
  for (const member of members) {const key=JSON.stringify([member.seamVersion,member.report.identity.modelHash]); let group=groups.get(key); if (!group) {group={seamVersion:member.seamVersion,modelHash:member.report.identity.modelHash,members:[]};groups.set(key,group);}group.members.push(member);}
  return {version:COHORT_VERSION, limits:{...COHORT_LIMITS}, members,
    groups:[...groups.values()].map(group=>({seamVersion:group.seamVersion,modelHash:group.modelHash,runs:group.members.length,
      paths:[...new Set(group.members.flatMap(m=>m.report.rows.map(r=>r.path)))].sort().map(path=>{
        const observations=group.members.map(member=>({name:member.name,runHash:member.report.identity.runHash,prefix:member.report.identity.prefix,
          row:member.report.rows.find(r=>r.path===path) ?? null}));
        const observed=observations.filter(o=>o.row!==null);
        return {path,observedInRuns:observed.length,notObservedInRuns:observations.length-observed.length,
          readInRuns:observed.filter(o=>o.row!.reads>0).length,changedInRuns:observed.filter(o=>o.row!.changes>0).length,
          reads:observed.reduce((n,o)=>n+o.row!.reads,0),mutations:observed.reduce((n,o)=>n+o.row!.mutations,0),changes:observed.reduce((n,o)=>n+o.row!.changes,0),observations};
      })})),
    scope:{coverage:'Selected named runs only; not the full required corpus',alignment:'Exact path within identical seam version and model hash only',missing:'Not observed in retained state/read/diff roster; unknown rather than zero',prefixes:'One selected cumulative prefix per run; unequal horizons remain explicit',causalContribution:'Not established by recorded activity',reduction:'No inactivity or co-occurrence finding authorizes removal'}};
}
