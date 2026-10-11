from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev293/check.json');assert c['assignedSources']==11321
cp=P/'CAMPAIGN3_HISTORY_CAMPAIGN2_INVENTORIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Campaign2 inventory lineage — 2026-10-08

**LOCAL DISPOSITION — currency and enumeration do not establish sufficiency.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Six sources reconcile the bounded closure inventory, three current-evidence
snapshots, the vector crosswalk audit and chronological autonomous self-review.
The bounded bridge has175 descriptors,82 entries, four transitions, five writable
patterns and zero read-only patterns.700 descriptor negative calls describe another
test loop; this inventory does not execute them. Probe/measurement/memory remain
absent in this profile. No exhaustive behavior or positive PERSIST-I witness follows.

Each currency snapshot selects18 reports. Each successor replaces five report
versions and preserves thirteen entries exactly. Production paths grow71 to76 to83,
adding prediction then task files; three then six retained paths change hashes.
166 preservation entries are not tests. Production fingerprints are not ModelIdentity
or binary identity. Nested report/source fingerprints are checked along with outer
report hashes; the snapshots remain historical rather than current-source claims.

The51 crosswalk IDs cover EVID-A..T,REG-A..R,AD-E1..13 exactly. All rows explicitly
remain QUALIFICATION OPEN with runtimeVerdict NONE.25 evidence-file names establish
existence, not historical test bytes or vector passes. ADAPT A-D, packaging and the
complete PRJ/IDN/OBS/SEM inventory are excluded. Later scoped qualification supplies
composition; this inventory cannot replace it.

The autonomous review preserves actual sharing/reentrancy controls, genuine route
sources instead of relabelled confounds, six-stage rollback and four removable-fault
continuations without repairing invalid models. Occurrence identity may be carried
as identity but cannot become adaptation magnitude. Universal trusted-host-code
noninterference is unproved. REG-E exposed a before-arithmetic gap despite numerical
rejection: matching versus mismatched D=0 controls measure one versus zero REG calls.
Two-variable generic evidence differs from the one-variable public profile. Finite
self-reviewed AD-E passes do not alone qualify the full thin causal event or Campaign2.

100 original narrative occurrences and all1,800 string leaves retain scope.
454 binding occurrences resolve;24 occurrences over nine exact source pairs remain
unresolved (orderedInputs, three scheduler versions, two traceBinding versions,
observation, adaptationRuntime and predictionExecution).77 existing backing resources
newly indexed. No global absence or fresh source-exact historical assay is claimed;
include these occurrences in final gap/dependent-claim reconciliation.

REV293:11,321 assigned /52 unassigned;196,285 narrative /212,373 backing;
2,593 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy are open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-campaign2-inventories-rev1','campaign3-history-source-roles-rev293'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: six Campaign2 inventory/self-review sources reconciled.
Start CAMPAIGN3_HISTORY_CAMPAIGN2_INVENTORIES_CHECKPOINT.md.
Three snapshots/51 historical open vectors; enumeration is not qualification.
454 exact bindings/24 unresolved occurrences over nine source pairs.
Source REV293:11321 assigned /52 unassigned;196285 narrative /212373 backing;
2593 backing resources. No runtime or historical assay rerun.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier/new gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
