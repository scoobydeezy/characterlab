from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-compiler-rev1';I=P/'campaign3-history-source-roles-rev156'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshPassingAssertions']==87 and i['assignedSources']==9869
cp=P/'CAMPAIGN3_HISTORY_GA_COMPILER_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA compiler progress history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Five sources;58 JSON string leaves;55 narrative/five
backing occurrences. Six exact source commitments;ten unavailable intermediate
implementations explicitly excluded from old-code-content claims. The recovery
report records current/local/all-ref Git path searches and known archive checks;
it does not claim exhaustive reconstruction of every unreferenced object.

All87 current declaration/source tests pass. The test source files still match their
historical commitments,but the current recipe set and implementation have evolved.
This result does not recreate the old52 declaration tests/30 recipe environment.
Current controls cover concrete compiler-owned67 bindings,goal/spec/holder/content
coupling,typed versus arbitrary canonical slots,unconditional PRJ where required,
SEM subject boundaries,frame/reference/cue policy checks and protocol descriptors.
No public scheduler or full build/reference suite was freshly run in this batch.

ProgressREV1 reports1866 tests:1851 passes and15 timeout failures across8 files,
then1866 passes with limited workers and unchanged timeouts. REV2 reports1918 tests
across252 files;REV3 reports146 affected tests across12 files and explicitly no full
suite rerun. These numbers and build/manifest assertions remain attributed historical
summaries,not independently reproduced full-suite receipts in this audit.

The five FixedCompilerCollectionElement positions must retain element grammar checks
rather than becoming scalar265 RecordField roles. The current implementation skips
that incorrect scalar serialization;the current source tests admit legitimate
channel/cue/loss collections and reject wrong namespaces/occurrence payloads.
Collection-role correction does not change a psychological identity family.

The concrete bounded fixture has separate body/baseline recall capacities and
retention/graph limits;these are local choices,not laws. Eight source originals3..10
contain four formation opportunities followed by four cue-only opportunities,with
eight qualified selection slots from the former. Four selector bindings are distinct
from eight slots. Current-only schedules do not prove goal/consequence lifecycle.
Actual source construction and protocol ownership descriptors do not prove terminal
hook execution,whole-model state admission,work bounds,joins or persistence.

SourceREV156:9,869 assigned/1,504 unassigned;18,050 narrative/183,423 backing;
919 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next source-profile declaration history and remaining authority/material evidence.
Formula343/Values90/15,formula pin,legacy log and prior exclusions remain separate.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
No production/model/allocation/verdict/corpus/obligation status changed. Jobs terminal.
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
route='''HQ-011 IN PROGRESS: GA compiler progress history reconciled.
Start CAMPAIGN3_HISTORY_GA_COMPILER_CHECKPOINT.md.
Five sources;87 current declaration/source tests PASS. Six exact source commitments;
ten unavailable intermediate implementations explicitly excluded from old-code claims.
Historical1866/1918/146 suite counts remain attributed reports,not fresh full replay.
Preserve15 reported timeouts and five collection-role/scalar correction.
SourceREV156:9869 assigned/1504 unassigned;18050 narrative/183423 backing;919 artifacts.
Next source-profile declaration history and remaining authority/material evidence.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
