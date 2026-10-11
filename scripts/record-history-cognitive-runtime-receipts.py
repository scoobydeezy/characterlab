from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev185/check.json');assert c['assignedSources']==10358
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_RUNTIME_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive runtime receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six early dice, rollback, runtime, history-boundary, math and substitution receipts
scope-reconciled.304 narrative/6 backing original occurrences; all1,263 string leaves;
253 exact bindings. Two historical files recovered from raw Git blobs, with exact
SHA equality: cognitiveMath and its earlier test. This is byte identity, not timestamp proof.

All21 original runtime result rows, including Save digests, match later qualification
replay when projected to original fields. Four later diagnostic columns are additions,
not changed historical outcomes.270 dice/140 active cases and11 identity histories
match the later mathematical replay. Historical dice exploration still used external
operands and its own RNG; the seven local-adapter rollback checks simulated scheduler
failure and did not qualify scheduler persistence or PERSIST-I.

Four baseline suites53 tests passed historically; all17 source substitutions have
actual failed test assertions. The writer excludes compile/anchor failures from detection.
Avoid and aggregate-evidence controls retain component scope. None was freshly rerun.

Seven exact old source identities in the early public runtime receipt remain unresolved:
adaptationRuntime, cognitiveExecution, cognitiveIngress, cognitiveState and the earlier
Factory/Model/Transforms tests. Search checked indexed exact archives and reachable Git
history at the exact paths; no global absence or rename/unreachable-object claim.
These seven are additional to80 exit-inventory identities and one scheduler identity.
Later output equality does not reconstruct those missing bytes or erase this obligation.

The64/65 history boundary receipt records64 genuinely acquired entries, atomic snapshot
failure on novel65 and terminal failed-run status. It omits a source-fingerprint manifest.
Current writer inspection is explanatory, not authenticated historical execution identity.
Its pre-failure Save digest alone cannot prove private-ledger rollback; separate final-trace
controls remain necessary. This source-attestation limitation remains in adequacy review.

SourceREV185:10,358 assigned/1,015 unassigned;131,393 narrative/211,258 backing;
1,192 indexed archives. Assignment is scope accounting, not source adequacy acceptance.
Next remaining historical receipt/support inventory and independent material-gap review.
Formula provenance,legacy log,Values90/15 remain open. HQ012 unstarted; Campaign3 NOT
EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED. No fresh runtime/build, model,
allocation, law, verdict, corpus promotion or obligation closure. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-runtime-receipts-rev1','campaign3-history-source-roles-rev185'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:six early cognitive runtime receipts scope-reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_RUNTIME_RECEIPTS_CHECKPOINT.md.
304 narrative/6 backing occurrences;1263 strings;253 exact source bindings.
Two exact Git archives recovered;21 original rows and math replay match.
Seven early runtime source gaps OPEN, plus80 exit-inventory and one scheduler hash.
64/65 receipt lacks historical source manifest;scope assignment is not adequacy.
SourceREV185:10358 assigned/1015 unassigned;131393 narrative/211258 backing;
1192 archives. Next remaining receipt/support inventory and material-gap review.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
