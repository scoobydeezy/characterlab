from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev177/check.json');assert c['assignedSources']==10285
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_PRESERVATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive preservation assays — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Reconciled18 original/refreshed preservation assay pairs:36 exact source records,
128 original narrative and2,168 backing occurrences. All6,170 string leaves are
schema-accounted, including short status/error/code fields. Result and scope trees
match across pairs after excluding fingerprint fields, except two explicit mutation
anchors: the expanded cognitive InputOnly guard and successor decoder. No original
report or production source was rewritten. These are historical receipts, not fresh
assay/test/build executions.

Preserve84 recorded fixed mutations with actual failed assertions or recorded
differential cases,18 separately passing expected-rejection interventions, and two
independent metadata-scan controls. Expected rejection is not an arbitrary test failure;
compile/anchor failure is not mutant detection. Exact source/from/to, failed-case and
diagnostic fields remain backing records with per-assay scope judgments.

Material findings remain explicit: direct host context.state access once defeated
the PRJ-only restriction; correction separated semantic execution from host context.
The generic A/B/absent-roster witness does not widen the bounded public profile, and
named hidden-operand exclusions do not prove arbitrary trusted-host noninterference.
The redundant staged-patch guard survived an earlier substitution and was removed;
actual WRT-diff enforcement carries that obligation. Exact target, family scope,
per-rule association and staged outputs remain separate controls.

Other preserved limits include zero-count topology, applicability versus gate state,
frozen gate versus staged write, pre-read collisions, target/gate accessor ordering,
inclusive bounds versus unbounded leaves, absent versus zero normal form, pre-instant
reference validation, ordinary/late/InputOnly stage distinctions, six explicit rollback
stages, observer-safe fixed pulse and SEM support, and PERSIST-D metadata rather than
PERSIST-I positive consumer qualification. Seventy-two independent gate cases share
transport/factory machinery; they are not an independent general interpreter.

Of120 source/harness fingerprint references,118 resolve exactly. Five previously
unindexed source identities were recovered as exact reachable Git blobs and preserved.
Two references to one earlier scheduler identity remain unresolved:
58ac5e7607b73829d3d7908f005e67b18d9a4da1b2a88cc3da5addbae99b6a67.
The declared search covered existing indexed archives and reachable exact-path whole
Git blobs, not all renamed/unreachable/remote/filesystem content. Refreshed scheduler
evidence has its own exact binding and cannot replace the missing earlier bytes.
RO021 retains materiality/adequacy of that gap; no absence-of-lost-findings claim.

SourceREV177:10,285 assigned/1,088 unassigned;129,870 narrative/211,150 backing;
1,190 indexed outside-census artifacts. The80 unresolved exit-inventory identities
remain separately tracked; this scheduler gap is additional, not silently merged
into that denominator. All21 exit-rationale support paths remain accounted.

Next remaining cognitive/formal contracts and historical planning roles, then
independent adequacy. Formula historical identity, legacy log, Values90/15 and prior
exclusions remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.
No fresh simulation/test/build, production change, new verdict, law selection,
corpus promotion or obligation closure.108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 CONDITIONAL but mandatory and UNSATISFIED;
RO022 CLOSED. All processes terminal; no user decision required.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
dirs=['campaign3-history-cognitive-preservation-rev1','campaign3-history-source-roles-rev177']
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
route='''HQ-011 IN PROGRESS:18 cognitive preservation assay pairs reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_PRESERVATION_CHECKPOINT.md.
36 sources/6170 string leaves;84 recorded mutations,18 expected-rejection and
two metadata controls preserved. Two anchor changes;no fresh assay execution.
120 source/harness bindings:118 exact,two unresolved occurrences of one scheduler
identity;five exact Git source recoveries.80 exit-inventory gaps remain separate.
SourceREV177:10285 assigned/1088 unassigned;129870 narrative/211150 backing;
1190 indexed archives. All21 exit-rationale support paths remain accounted.
Next remaining contracts/planning roles,then independent adequacy.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
