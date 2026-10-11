from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev197/check.json');assert c['assignedSources']==10519
cp=P/'CAMPAIGN3_HISTORY_GA_INTEGRATION_CHECKPOINTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA integration checkpoint reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Twenty GA integration checkpoint documents reconciled with211 exact original narrative
occurrences. Test counts and mutation claims remain dated statements with separately
owned receipt/source-binding obligations. No old writer, runtime, test, mutant or
build was rerun, and no historical count is promoted to current whole-suite coverage.

The sequence replaces schedule-provided context, positions, retained event read sets,
focal pointers and final competitor bytes with their actual bounded source/recall
paths. Missing context does not erase independent visual perception. Missing current
cue cannot be repaired with an old marker file; insufficient recall capacity cannot
be bypassed by supplying all retained acquisitions. Actual role projection is distinct
from coordinates, and a designated control trial cannot borrow causal support while
its consumed operands still earn use. Identical safe evidence under different hidden
delivery laws preserves a possible false attribution, not authoritative causal truth.

Recorded source corrections remain explicit: panel context and batch observer aliases,
SEM-001C/SEM-001H producer tags without widening the frozen whitelist, early experience
reservation rather than a late call bearing an earlier phase label, and independently
allocated actual role claims. Fixture failures involving missing reserve members,
signal prefixes, rational denominators, support ordering, required role claims and
lexical identity assumptions did not authorize weakening production validators.

The source domain grew from17 successful opportunities to18 completed sources when
zero-capacity cue selection was enrolled. That selection can form nothing while an
independent cue recalls prior memory. Later consolidation of both cues into one actual
request preserves18 originals,10 visual sweeps,16 panel sweeps and18 selection slots.
Source admission limits remain separate from cognitive capacity and successful memory.
The final competitor now uses actual tenth-source acquisition; supplied later use
remains a separately labeled comparator.

The association-owner defect required canonical node ordering and corresponding
matrix-axis reindexing. The rejected regression and strengthened asymmetric-permutation
witness remain historical. Retention uses common B0 protection before overlaying current
metadata on survivors; current credit cannot rescue current loss. Actual presentation,
ordinary use and recall remain separate. Formation advances association time even at
zero graph capacity; retention-only work preserves that clock.

Verification scope corrections matter: the1827-test historical report included43
reference test files despite its active-source name. The later1679-test active-only
run began before final multimodal edits;119 affected tests supplied the later scoped
check. Those totals are not additive. Component/source fixtures, separate scheduler
handoff tests and symbolic role crosswalks are not one authenticated public causal chain.
The80-invocation/58-output GA-local work analysis explicitly withheld a full ceiling
until inherited work and separate shared-slot accounting were included.

SourceREV197:10,519 assigned/854 unassigned;132,937 narrative/211,639 backing;
1,192 indexed archives. No new provenance gap. Two composition,two Values,seven
cognitive,80 exit-inventory and one scheduler identity groups remain open, alongside
formula provenance,legacy log,remaining material support and independent adequacy.
HQ012 unstarted;Campaign3 NOT EXIT-READY. No model/law/allocation/verdict/corpus or
obligation status changed.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-ga-integration-checkpoints-rev1','campaign3-history-source-roles-rev197'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:20 GA integration checkpoints reconciled.
Start CAMPAIGN3_HISTORY_GA_INTEGRATION_CHECKPOINTS_CHECKPOINT.md.
211 narrative occurrences;source/read/SEM/reservation and matrix-axis corrections retained.
Regression counts remain historical;component joins do not imply public qualification.
SourceREV197:10519 assigned/854 unassigned;132937 narrative/211639 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
