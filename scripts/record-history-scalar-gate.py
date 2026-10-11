from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev296/check.json');assert c['assignedSources']==11328
cp=P/'CAMPAIGN3_HISTORY_SCALAR_GATE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Independent scalar gate proof — 2026-10-08

**LOCAL DISPOSITION — independent arithmetic, shared execution transport.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The original finite gate receipt covers the complete72-case product of signed step
+/-1, prior0/1/9/10, frozen gate0/1/8 and count0/1/2. Independent integer arithmetic
rederives all72 baseline expectations and155 reported mutant-difference expectations.
Tolerance changes by signed count*step only when the pre-event gate is zero, remains
bounded0..10; other leaves become gate+count/count/count. Sparse zero requires removal,
not an explicit baseline set. Stored accepted magnitudes/ops/diffs/five reads/removal
counts agree. Out-of-range cases report rollback and the exact magnitude error.

Six substitutions differ in32/48/20/8/1/46 cases: ignored/inverted/wrong gate,
discarded sign, explicit baseline set and unchanged set. This is155 difference
occurrences, not155 independent experiments. Expected arithmetic is independent;
canonical transport and production factory setup are shared. It is not a general
REG interpreter or complete REG/persistence/FCT6/PHEN-ADAPT proof.

SuccessorREV2 retains the baseline and exact harness fingerprint plus five mutant
result arrays. The target-as-gate mutant changes: original20 arithmetic differences
become66 TRACE_VALIDATION_FAILURE differences under the revised evaluator. Preserve
that changed detection mechanism rather than calling the refreshed witness identical.
Current harness inspection scopes rollback to state/outputs/trace/clock; complete
queue/allocator rollback belongs to separately preserved evidence. No runtime or
historical mutation writer was rerun here.

Three original narrative occurrences and all305 string leaves are accounted for.
Two exact source bindings resolve, including the committed harness; one existing
backing resource newly indexed. No source gap in this batch. Original receipt and
successor remain untouched.

REV296:11,328 assigned /45 unassigned;197,294 narrative /212,373 backing;
2,595 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-scalar-gate-rev1','campaign3-history-source-roles-rev296'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: independent scalar gate receipt reconciled.
Start CAMPAIGN3_HISTORY_SCALAR_GATE_CHECKPOINT.md.
72 baseline/155 mutant expectations rederived; changed successor detection preserved.
Two exact source bindings; shared transport and finite rollback scope explicit.
Source REV296:11328 assigned /45 unassigned;197294 narrative /212373 backing;
2595 backing resources. No historical runtime or writer rerun.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps and artifact limits in final reconciliation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
