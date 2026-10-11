from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-source-profiles-rev1';I=P/'campaign3-history-source-roles-rev157'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==9 and i['assignedSources']==9873
cp=P/'CAMPAIGN3_HISTORY_GA_SOURCE_PROFILES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA source-profile history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Four sources;284 JSON string leaves;29 narrative/two
backing occurrences;13 exact bindings;no new archive or unavailable source.

The eight-record source/original builder and original structural reviewer reproduce
exactly,including nine injected faults. Authored scene objects remain governed
source-side referents,not perceptual files or tracking continuity. Event role differs
from causal role. Permitted observations cannot obtain Actor from position/panel stage.
No authored significance,baseline,selected winner,assessment or acquisition is supplied.
Selection and cue flags remain independent consumers,subject to requested sources.
Goal assessment additionally requires actual consequence,goal and admitted memory.

The draft scene bounds permit ten frames/three items and panel bounds sixteen frames.
Those maxima did not qualify the then-current single-point runtime. Exact schedules,
content membership,source allocation and completed-parent admission remain separate
proofs. Observer-safe order cannot depend on hidden marker identity;one-point8/9/10
constructors remain controls. The nine symbolic faults reject the corresponding
identity,role,capacity,cue coupling,authored result,callback and ordering substitutions.

REV2 preserves prior grammar except adding a required ExecutionPolicy DefinitionId
inside ObservationUsePlan. Its version,citation and explanatory text change explicitly.
The policy binds purposes/calibration to exact registered stages;original time cannot
silently select capacity. The REV1 reviewer is not credited with validating this added
field. Current87 declaration/source tests from the preceding batch remain separate
later evidence and were not rerun solely for bookkeeping.

SourceREV157:9,873 assigned/1,500 unassigned;18,079 narrative/183,425 backing;
919 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next requested-source/visual-carrier and calibration policy history,then remaining
material authority reconciliation. Formula343/Values90/15,formula pin,legacy log and
historical exclusions remain separate. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
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
route='''HQ-011 IN PROGRESS: GA source-profile history reconciled.
Start CAMPAIGN3_HISTORY_GA_SOURCE_PROFILES_CHECKPOINT.md.
Four sources;exact symbolic builder/reviewer;nine original faults PASS.
ExecutionPolicy successor delta preserved;REV1 reviewer does not cover added field.
Source truth/perceptual identity and grammar/runtime distinctions remain explicit.
13 exact bindings;no new archive or missing source. Prior87 current tests reused.
SourceREV157:9873 assigned/1500 unassigned;18079 narrative/183425 backing;919 artifacts.
Next requested-source/visual-carrier and calibration policy history.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
