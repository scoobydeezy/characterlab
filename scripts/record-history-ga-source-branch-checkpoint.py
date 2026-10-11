from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-source-branch-rev1';I=P/'campaign3-history-source-roles-rev161'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==9 and c['freshTests']==31 and i['assignedSources']==9905
cp=P/'CAMPAIGN3_HISTORY_GA_SOURCE_BRANCH_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Body-source branch and physical reserve history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Seven sources;229 JSON string leaves;94 narrative/28 backing
occurrences;five exact bindings and one unavailable historical implementation.

31 current component tests pass:8 reserve source,10 observation/opportunity,
8 body recall and5 trial-panel perception. All21 names in the historical baseline
composition receipt are accounted for by13 fresh cases and8 cases from the prior
31-case composition suite. That prior suite was not rerun. Current tests do not
establish execution of unavailable historical source bytes.

The unchanged original carrier validator and its nine fault assertions pass as an
executable prefix. Execution deliberately stops before its source-hash loop;this is
not a complete replay of the historical reviewer or builder. The committed
localReserveSource.ts hash e75a4987d153a532a5de42daee85cb146e0b5afcfdec83930dda3c3a01fa29b5
was not found in directed local filename search,all-ref Git path history or known
archives. Its historical implementation-content and complete reproduction claims
are excluded. No claim of exhaustive recovery of every unreferenced Git object.

One actual completed source supports independent selection and cue. Present panel,
visual or body evidence can justify one shared experience;event detection requires
panel or visual evidence. Multiple body views do not allocate multiple experiences.
All-unavailable body samples have no fake experience;an empty selector remains
possible. Unsampled is distinct from sampled unavailable. A combined-source owner
must not use the body-only adapter to create a second reservation.

Physical reserve keys differ from safe signals and occurrence identities. Three
anchors remain independently owned;query never reanchors,while zero delivery does
reanchor only its target. Safe observations omit physical keys,anchors,kinetics,
amounts and delivery arithmetic. Hidden within-bin changes and physical renaming
leave safe evidence unchanged. Uniform unavailability does not expose its cause.

Consequence baseline must be an actually recalled retained matching Before.
Missing,lost,ambiguous,unrecalled or foreign context remains unavailable;new After
cannot serve as its own baseline. No host cache,trace lookup or schedule repairs
missing evidence. Supported attribution can coexist with unqualified change when
baseline recall capacity is zero. Phase130 cannot dispatch backward to40 or borrow
provisional sibling output. BS-A through BS-J remain historical frozen vectors;
these narrower component checks are not their public qualification.

SourceREV161:9,905 assigned/1,468 unassigned;18,368 narrative/183,497 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next source schedule/sample bridge and remaining owner/carrier history,then authority
adequacy. Formula343/Values90/15,formula pin,legacy log and prior exclusions stay open.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21. All jobs terminal.
No production/model/allocation/verdict/corpus/obligation status changed.
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
route='''HQ-011 IN PROGRESS: body-source branch/physical reserve history reconciled.
Start CAMPAIGN3_HISTORY_GA_SOURCE_BRANCH_CHECKPOINT.md.
Seven sources;31 fresh component tests/nine original validator-prefix faults PASS.
21 historical test names accounted;eight use prior composition receipt,not rerun.
Five exact bindings;one unavailable historical implementation explicitly excluded.
Full old builder/reviewer replay not claimed. Physical truth/safe evidence stay distinct.
SourceREV161:9905 assigned/1468 unassigned;18368 narrative/183497 backing;920 artifacts.
Next source schedule/sample bridge and remaining owner/carrier history;adequacy open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
