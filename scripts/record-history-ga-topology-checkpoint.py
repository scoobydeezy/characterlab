from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-topology-rev1';I=P/'campaign3-history-source-roles-rev153'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaultExecutions']==49 and i['assignedSources']==9850
cp=P/'CAMPAIGN3_HISTORY_GA_TOPOLOGY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# General Attention topology and output history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Nine newly assigned sources and two previously assigned
successor packets reviewed;1,251 JSON string leaves;302 narrative/8 backing
occurrences;25 exact bindings;one authenticated builder reconstruction.

Four original reviewers reproduce49 structural fault checks. The current output
builder reproduces its complete REV2 artifact. Original receipts and assertions
are unchanged. The obsolete REV1 output declaration used eight unregistered
identity names in16 stage/rule positions. Reversing precisely those substitutions
and the output destination recovers the original builder's committed SHA:
c5a9e959abb5232cecf169bd008a49b9221b51dd1d565dbd1e230fe26c243191.
This authenticates reconstructed bytes; it is not Git recovery or chronology proof.
The correction reused existing identities and made no numeric allocation.

Topology REV1's66 templates include three independent goal-baseline stages.
REV2 adds only the previously omitted terminal physical replenishment110 stage;
the preceding66 declarations and conditional edges remain unchanged. Output REV3
likewise retains all prior declarations and adds one borrowed physical result.
Neither template count is a whole-model work ceiling. Goal-baseline recollection
remains separate from ordinary body recall and event presentation. Conditional
last-parent joins denote one evaluation, not one evaluation per parent.

Transport output does not imply fresh identity. Empty selectors allocate their
selection occurrence; absent acquisition or empty recall does not fabricate one.
Unavailable actual consequence/attribution remains different from an absent branch.
Safe source observations share one reserved experience; hidden world bindings and
observer file counters retain their different ownership. The symbolic reviews do
not execute branch predicates, actual allocation slots, future scheduling, causal
same-phase bindings, joins, B0 patches, persistence or rollback.

The first unpersisted review attempt correctly rejected two already assigned
successor sources. Their existing roles were retained and neither was counted again.
GOA-A30/GOA-B17 allocation and replenishment production claims are explicitly
preserved as historical component claims pending the next receipt review; they were
not freshly executed by this batch. Accessor and registration gates also remain next.

SourceREV153:9,850 assigned/1,523 unassigned;17,934 narrative/183,114 backing;
918 outside-census artifacts. Counts are accounting, not adequacy. No production,
model, allocation, verdict, corpus or obligation status changed. Formula343/Values90/15,
formula pin, legacy log and earlier historical exclusions remain separate.
HQ012 unstarted; exitAuditREV111 unchanged; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: GA topology/output history reconciled.
Start CAMPAIGN3_HISTORY_GA_TOPOLOGY_CHECKPOINT.md.
Nine newly assigned sources plus two preserved successor roles;49 original symbolic
fault checks and exact REV2 builder reproduction. Eight corrected identity names;
old builder recovered against committed SHA. No fresh runtime qualification.
66 prior stages unchanged when terminal physical replenishment becomes67.
25 exact bindings;one archive;no missing bytes. First duplicate-source guard preserved.
SourceREV153:9850 assigned/1523 unassigned;17934 narrative/183114 backing;918 artifacts.
Next allocation witnesses, replenishment production/failure history, accessors and
registration carriers. All jobs terminal. Formula343/Values90/15 separate;formula pin,
legacy log and earlier exclusions OPEN. Counts not adequacy. HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
