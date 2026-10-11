from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev251/check.json');assert c['assignedSources']==11091
cp=P/'CAMPAIGN3_HISTORY_FACTORY_ADMISSION_PLANS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical factory admission planning reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven sources preserve156 exact original narrative occurrences. Design acceptance,
component implementation, evidence inventories and bounded factory release are separate.
The later factory verdict qualifies original no-RNG profiles; generic family/roster
controls do not widen public admission. Memory prefix replay has its own restore contract.

The original FCT5 full-save continuation included incomplete transition traces. Exact
save equality therefore did not prove trace completeness. Later trace/factory evidence
supplies scoped closure without rewriting that earlier receipt. The first VALR fixture
failed structural decoding before its intended compiler stage; its cyclic replacement
provides the stage witness. The936-test count includes reference tests, and an earlier
worker configuration failure is not a waived test assertion.

Restore preparation distinguishes unpublished local state from scheduler publication.
The facade checks metadata8/9/10 independently, saved-time REG and exact original pending
inputs before activation. Source reachability is not exhaustive instrumentation. State-ID
scan, build-inventory substitution and the positive absent-consumer PERSISTI intervention
remain different obligations; later cognitive/module-graph proof retains its own scope.

Ordered-input lists preserve order and repeated occurrences. The accepted profile is
selected before decoding; tuple shape cannot grant scheduling authority. Admitted-input
capabilities are local and expiring, not serialized provenance. Failure precedes semantic
output allocation even when an injected event already has a scheduling identity; whole
rollback covers separately staged allocations. Initial state validation is not WRT.

Source REV251:11,091 assigned /282 unassigned;191,726 narrative /212,202 backing;
1,255 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-factory-admission-plans-rev1','campaign3-history-source-roles-rev251'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: factory design and staged admission history reconciled.
Start CAMPAIGN3_HISTORY_FACTORY_ADMISSION_PLANS_CHECKPOINT.md.
Seven sources;156 original narrative occurrences. Trace completeness, validation-stage
failure, input authority and scoped later qualification remain distinct.
Source REV251:11091 assigned /282 unassigned;191726 narrative /212202 backing;
1255 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
