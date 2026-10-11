"""Record symbolic identity-role history and its claim limits."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-identity-roles-rev1';I=P/'campaign3-history-source-roles-rev152'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaultExecutions']==390
cp=P/'CAMPAIGN3_HISTORY_GA_IDENTITY_ROLES_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
cp.write_text('''# General Attention identity-role history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Fifty-one whole sources across17 revisions;18,203 JSON string
leaves;159 narrative and17 backing occurrences;284 exact bindings, no new exclusion.

All17 original inventory builders and17 original reviewers reproduce their full
committed outputs. The inventories grow from66 records/72 identity positions/82
recursive boundaries to163/165/208. Original assertions and historical artifacts
remain unchanged. The390 fault-check executions span33 distinct labels and34 actual
mutation bodies; they are not390 independent psychological findings.

The initial pending RetainedEncodingUnit boundary becomes a declared recursive
record in revision2. Later revisions add root keys, physical reserve carriers,
requested source products, governed definitions, source-stage transport, acquisition,
recall, concern, goal/attribution, calibration, retention and presentation wrappers.
Optional fields preserve their underlying role when present. Collection elements,
scalar record fields, scalar state-map keys and composite record keys stay distinct.

The phrase six new physical root map keys in revision3 meant concrete storage keys.
Revision4 explicitly corrects it: those keys belong to cognitive/perception roots,
not PhysicalBody. The actual physical reserve key is a composite character/reserve
record and retains its separate owner. Protocol singleton has no scalar map-key role.
Neither a namespace nor a role inventory grants a cognitive read or replaces PRJ.

One fault label changes its actual injection: reuse-appraisal-id-for-concern uses
Appraisal1129 through revision9, then CandidateOptions1132 from revision10. Both
are wrong for Concern1130. Four fresh direct probes confirm revisions9 and17 reject
both substitutions. The original label/body history is retained; later executions
are not described as the same appraisal-specific injection.

Revisions16 and17 have byte-equal role positions and boundaries despite revision17's
registration carrier adding the omitted physical replenishment stage and phase110.
This is direct evidence that complete identity-role coverage cannot establish complete
causal topology. The stage's component and failed/corrected source fixture remain
separate history for the registration batch. No runtime or component tests were run
in this batch, and no public admission, ownership enforcement or persistence is claimed.

SourceREV152:9,841 assigned /1,532 unassigned;17,632 narrative /183,106 backing;
917 outside-census artifacts. Prior roles and artifacts remain unchanged. Counts
are accounting, not adequacy. No production code, model, allocation, verdict,
corpus or obligation status changed. All processes are terminal.

Next: complete registration/topology, output and occurrence closure, beginning with
GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.md, GA_OUTPUT_AND_OCCURRENCE_CLOSURE_REV1.md and
GA_LOCAL_REPLENISHMENT_STAGE_REV1.md. Retain source/carrier component provenance
and historical exclusions for final HQ-011 adequacy. Formula343/Values90/15 and
missing historical formula/legacy-log provenance remain separate. HQ012 is unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21;exitAuditREV111 unchanged.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=load(rp);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()];added=0
for p in paths:
 if p in existing:continue
 r['reportReviews'].append(dict(path=p,obligations=obs));added+=1
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: GA identity-role history reconciled.
Start CAMPAIGN3_HISTORY_GA_IDENTITY_ROLES_CHECKPOINT.md.
51 sources;17 exact inventory/reviewer reconstructions;390 symbolic fault executions PASS.
33 fault labels/34 bodies;four paired wrong-namespace probes preserve1129/1132 drift.
Six cognitive/perception map keys remain separate from composite physical reserve key.
Equal REV16/17 role inventories do not prove complete replenishment topology.
284 exact bindings;no new unavailable source or archive. No new runtime qualification.
SourceREV152:9841 assigned/1532 unassigned;17632 narrative/183106 backing;917 outside-census artifacts.
Next composed topology, output/occurrence and replenishment registration history.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacylog and earlier
historical exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
head=old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0];cur.write_text(head+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle);s=s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1);a.write_text(s,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
