from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev204/check.json');assert c['assignedSources']==10804
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_PROOF_COHORTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation proof cohort reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Nine historical mutation reports and the AD-E13 acceptance review reconciled:
911 original narrative/one backing occurrences and1,840 complete JSON string leaves.
35 recorded mutant instances include34 detections and one survived redundant staged-
patch guard. Each result agrees with its recorded test rows; revisions are not counted
as independent psychological findings. No old proof writer or mutant was rerun.

The first write-boundary receipt remains INCOMPLETE. Its survived patch-byte check
was later removed because the actual-diff guard owned effective-write detection.
Subsequent16/23/24/25-test cohorts add distinct scope,subject,staged association and
independent pre-snapshot oracle controls. They do not silently replace the first
receipt. Two-rule applicability checks preserve false-gate versus no-match dispatch.

AD-E13's21-case matrix separates guaranteed construction collision from contingent
runtime collision. Mixed Gate already meant original Always versus duplicate
FrozenBaseline; clarification did not change or rerun the experiment. Correct Failed
status after a rejected instant does not imply lost committed state. Public snapshot
checks do not independently prove queue/allocator rollback. The static-invariant
receipt has13 tests/seven omissions with its own bounded initial/restore/future-writer
scope. None is universal interpreter equivalence or whole factory qualification.

Twelve exact source bindings resolve. One old adaptationDomains.ts body was recovered
byte-for-byte from Git commit42c2713ce044a04d53c294032462dd6ac25446e0 and preserved.
Five additional historical identities remain unrecovered:two adaptationEvaluation.ts
versions and three campaign2MutationEvidence.test.ts versions. Exact hashes,affected
reports and bounded search evidence are in this batch's unresolved.json. Current
files,indexed archives,reachable exact-path Git raw/LF/CRLF and seven exact-basename
workspace candidates were checked. This is not a global-absence claim. The five
hashes are not members of the existing80 exit-inventory gap list.

RO-C3-021 remains unsatisfied. Independent adequacy must recover those exact bodies
or explicitly dispose the affected historical claims before HQ012. Changed current
code and later green receipts cannot stand in for their committed identities.

SourceREV204:10,804 assigned/569 unassigned;185,530 narrative/211,657 backing;
1,193 indexed archives. Existing composition,Values,cognitive,exit-inventory and
scheduler gaps remain,now with five ADAPT identity groups. Formula provenance,
legacy log,remaining support,post-cutoff joins and independent adequacy remain open.
No runtime,test,build,model,law,allocation,verdict,corpus or obligation status changed.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-proof-cohorts-rev1','campaign3-history-source-roles-rev204'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:10 ADAPT proof/review sources reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_PROOF_COHORTS_CHECKPOINT.md.
911 narrative/1 backing;35 historical mutants include one survived redundant guard.
One exact domain source recovered from Git;five evaluator/test identity groups OPEN.
SourceREV204:10804 assigned/569 unassigned;185530 narrative/211657 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:five ADAPT,two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
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
