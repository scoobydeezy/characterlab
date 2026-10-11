from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev175/check.json');assert c['assignedSources']==10238
cp=P/'CAMPAIGN3_HISTORY_EXIT_SUPPORT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit supporting sources — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Reconciled18 of the21 support paths identified by the rationale union: six partial-
coverage audits with six existing checker receipts, plus three longitudinal
implementation checkpoints with three development receipts. SourceREV174/175 add
154 original narrative and9 backing occurrences. All963 JSON string leaves are
schema-accounted including short status/identity fields. All462 original referenced
file occurrences match their recorded SHA256. This is historical scope and byte
verification, not fresh execution of the old checkers' full child chains or tests.

Partial audits preserve tolerance versus acquired sensitization, one motive with
alternative actions, episode/summary credit, threat/action dissociation, serious
scalar affect competitors, cross-context identity and enacted coercion, episode
testimony versus interference expectation, and longitudinal integration requirements.
Their later bounded supersessions are linked through the reviewed audit chain;
no general psychological law or whole-family/whole-campaign completion follows.
Four bounded promotions occur in these six audits; the separate belief audit owns
the fifth of20 starting partial clauses. Historical missing-coverage claims are
neither current implementation absence nor executed failures.

Development checkpoints retain qualified:false. Goal seed0 coarse receiving equality
is real; FineStanding is a comparator, not preferred calibration. Preserve routine
HABIT_CODEC failures and seed0 non-resumption despite availability/maintained goal.
Habit's zero-standing relearning and practice-memory loss do not alone execute native
biography. Native source ownership is not a joined native scheduler/Save132 admission.
Stored/Derived diagnostic caches and full raw journals preclude cache-free or global
erasure claims. Later frozen goal/routine/habit qualifications remain separate from
development tests, selected prefixes and source-reuse receipts.

SourceREV175:10,238 assigned/1,135 unassigned;129,671 narrative/208,666 backing;
1,185 indexed outside-census artifacts. The earlier consolidation remains unchanged:
740/820 inventory identities recovered and80 historical identities explicitly OPEN.
No current-text substitution or absence-of-lost-findings claim. Original sources,
model bytes, verdicts, snapshots and obligation statuses are unchanged.

Three union-listed supporting sources remain: CAMPAIGN2_COGNITIVE_QUALIFICATION.md,
CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md and CAMPAIGN2_COMPLETION_REVIEW.md.
Other linked unassigned evidence still needs its own role; exact hashes do not grant
transitive acceptance. Continue those sources and remaining evidence universe before
independent adequacy. Formula historical identity, legacy log, Values90/15 and prior
exclusions remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.

No fresh runtime simulation/test/build, new verdict, corpus promotion, law selection
or obligation closure.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 CONDITIONAL but mandatory and UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
dirs=['campaign3-history-partial-coverage-support-rev1','campaign3-history-longitudinal-implementation-support-rev1','campaign3-history-source-roles-rev174','campaign3-history-source-roles-rev175']
paths=[p.as_posix() for d in dirs for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:18 of21 exit-audit support sources reconciled.
Start CAMPAIGN3_HISTORY_EXIT_SUPPORT_CHECKPOINT.md.
Six partial audits/receipts and three longitudinal development pairs;462 exact
reference bindings;963 JSON string leaves. Historical checks,not fresh execution.
SourceREV175:10238 assigned/1135 unassigned;129671 narrative/208666 backing;
1185 indexed archives.740/820 inventory identities recovered;80 identities OPEN.
Next C2 cognitive/persistence/completion support,then remaining universe/adequacy.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
