from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev220/check.json');assert c['assignedSources']==10907
cp=P/'CAMPAIGN3_HISTORY_MEMORY_PACKAGING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory symbolic and packaging reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three historical documents and all 109 original narrative occurrences are reconciled:
M5 symbolic closure, successor packaging and the typed transition-wrapper decision.
Their staged acceptance is linked to the verified blocked/corrected packets and later
bounded runtime qualification. No document or frozen packet is rewritten.

The symbolic correction withdrew global projection registry rows, preserved the
existing state-family DefinitionVersion and kept private trace SeamVersion tied to
memory semantics. Source identity did not grant read permission; IDN roster values
remained S0/run data. Delayed recall used scheduler-event authentication without a
semantic cue occurrence or learning-route entry.

Packaging rejected the anonymous envelope in favor of three exact typed wrappers.
Requirements remain owned by the executing transition. Registry profile, inner
registration version and executing seam version have separate responsibilities.
Explicit empty sets, absent schema fields, dependency order and accessor uniqueness
retain their distinct meaning. No external static-binding table or version fallback
is admitted. Hashable altered requirements can still fail exact-profile admission.

Sixteen control identities derive F/R from committed declarations. Equal suppressed
outputs do not merge model identities. Delay1 is signed model time with checked
real/private overflow. Prefix restore validates whole-save equality before reminting
capabilities from detached pending facts; no antirollback claim follows.

The old14-role slot5 count is superseded by the accepted15-role correction, while
blocked14-role specimens remain never admitted. Shape acceptance does not itself
freeze numbers or qualify behavior. Later acceptance retains the explicit substrate
permutation witness and generic-component/public-exclusion limits; it does not
qualify arbitrary memory profiles or a general retrieval mechanism.

Source REV220: 10,907 assigned /466 unassigned; 188,298 narrative /211,856 backing;
1,219 indexed backing resources. No new archive or source gap. No runtime, test,
build, constructor or historical writer rerun. Prior source gaps, formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. No model, law,
allocation, verdict, corpus or obligation status change. HQ012 unstarted;
Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-packaging-rev1','campaign3-history-source-roles-rev220'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: three memory symbolic/packaging sources reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_PACKAGING_CHECKPOINT.md.
109 narrative occurrences; rejected projection/envelope proposals preserved.
Typed wrapper acceptance and15-role correction joined to later bounded qualification.
Source REV220:10907 assigned /466 unassigned;188298 narrative /211856 backing;
1219 backing resources. Values post-cutoff reviews retain separate denominators.
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
