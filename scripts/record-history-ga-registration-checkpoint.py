from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-registration-rev1';I=P/'campaign3-history-source-roles-rev155'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshPassingAssertions']==19 and i['assignedSources']==9864
cp=P/'CAMPAIGN3_HISTORY_GA_REGISTRATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA accessor and registration history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Seven sources;812 JSON string leaves;47 narrative/one
backing occurrence;17 exact bindings;no new archive or unavailable source.

The original carrier builder and both symbolic reviewers reproduce exactly:
17 original shape faults rejected. Nineteen current focused tests pass:seven
registration,eight accessor,four recall-partition controls. They are current
component/compiler evidence,not reproduction of the old full-suite environment.

Carrier REV2 adds only replenishment and phase110. The later write-scope correction
preserves frozen704/1 and introduces a distinct successor. Existing322 authorizes
Campaign2 families,not explicit149 paths. Cognitive learning owners retain family
permissions;perception,physical replenishment and two goal lifecycle owners use
explicit paths. ReadOnly never stands in for a writer;protocol ownership is excluded.
No psychological state,family,route or law was silently changed by that correction.

Eight accessors distinguish roster-qualified character leaves from observer windows.
Recall partition strips retention metadata,retains actual evidence,validates sibling
state and cannot restore a lost child. Absent cues suppress owner reads while retaining
roster admission. GAP-B intentionally omits an episode leaf to verify no read;this
is not proof that full model admission permits missing state. Available cues require
the owner leaf. Wrong holder/root/grammar/domain,foreign or stale cue,and detached
result mutation controls pass. Baseline projection sharing does not share its budget.

Registration tests compare all67 template schemas and complete canonical rows against
synthetic compiler-owned bindings. Wrong phase,event,seam,schema,version,ReadDomain,
definition,write selector,subject projection or output cardinality rejects. These
bindings still require prior semantic validation; equality to them alone cannot
qualify a public source,model identity,producer join,physical patch or persistence.

SourceREV155:9,864 assigned/1,509 unassigned;17,995 narrative/183,418 backing;
919 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next historical compiler progress and concrete declaration/source admission evidence.
Formula343/Values90/15,formula pin,legacy log and earlier exclusions remain separate.
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
route='''HQ-011 IN PROGRESS: GA accessor/registration history reconciled.
Start CAMPAIGN3_HISTORY_GA_REGISTRATION_CHECKPOINT.md.
Seven sources;19 current focused tests;17 original symbolic faults and exact builder.
Distinct path-scope successor preserves frozen704 and cognitive family authorization.
Absent-cue no-read is not missing-state admission;synthetic bindings are not public proof.
17 exact bindings;no new archive or missing source.
SourceREV155:9864 assigned/1509 unassigned;17995 narrative/183418 backing;919 artifacts.
Next historical compiler progress and concrete declaration/source admission evidence.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
