from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev235/check.json');assert c['assignedSources']==10967
cp=P/'CAMPAIGN3_HISTORY_STATE_ORDERING_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# State, ordering and numeric authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four formal sources preserve106 original narrative occurrences. Accepted substrate
machinery, instantiated seam semantics and psychological qualification remain separate.
The numeric/exact-1 profile admits only the bounded bridge's reachable operators;
operators present in the binary do not become admitted model operations. Exact negative
floor, reduced rational arithmetic, checked time and explicit failures remain distinct
from rounding, conversion, saturation or implicit host-number arithmetic. Zero draws
retain the independently committed RNG identity.

Ordering permits same/later-phase staged work while external reads and saves require
quiescent committed state. A failed instant restores state, pending events and allocators
exactly, publishes only non-authoritative failure diagnostics and terminates the run.
Phase150 is a settlement sentinel, never an event. Strict observation entry cutoffs and
the prohibition on re-entering current appraisal survive later regulatory changes.
Temporal availability alone grants no epistemic permission or general ORD001 closure.
Run-global event sequence and observer-owned perception identity allocators are distinct.

State ownership is one authority per writable leaf, not one authority per producer or
one leaf per authority. First-divergence validation order remains explicit; hashes do
not prove structural equality or authorize writes. Cognitive learning evidence and
truth-side automatic adaptation have separate typed routes. Fallible perceptual tracks
are not truth identities; frozen pre-attempt expectations cannot be rebuilt after learning.
Historical proposed-owner and allocation-pending rows remain dated scope statements;
later bounded seam acceptance must supply its own authority and evidence.

The seam template is an authoring/readiness rule, not an implemented seam or experiment.
Its acceptance requirement excludes unresolved decisions affecting authoritative results;
tests cannot manufacture missing semantics. Future excluded research questions remain
separate from architectural owner blockers under the current escalation policy.

Source REV235:10,967 assigned /406 unassigned;189,799 narrative /211,939 backing;
1,221 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-state-ordering-authority-rev1','campaign3-history-source-roles-rev235'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: state/ordering/numeric authority reconciled.
Start CAMPAIGN3_HISTORY_STATE_ORDERING_AUTHORITY_CHECKPOINT.md.
Four sources;106 narrative occurrences; no new archive/source gap or rerun.
Substrate enforcement does not supply missing seam semantics or psychological proof.
Source REV235:10967 assigned /406 unassigned;189799 narrative /211939 backing;
1221 backing resources. Values post-cutoff reviews retain separate denominators.
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
