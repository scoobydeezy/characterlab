from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-values-backing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert (c['runSources'],c['stringOccurrences'],c['allPrimitiveLeaves'])==(512,77414,103766)
cp=P/'CAMPAIGN3_HISTORY_VALUES_BACKING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Values post-cutoff backing reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

The previously unclassified512 Values component/native run files now have explicit
backing dispositions.78 actual leaf schemas cover103,766 primitive leaves and77,414
string occurrences, including short labels. Every string has a stable source-hash,
JSON-pointer and text-derived identity. Exact text remains in its original hash-bound
source; no canonical bytes or large encoded fields are rewritten. Unknown strings
or fields fail the schema review. Numeric and null leaves are counted separately.

These receipts contain controlled law/case/mode labels, exact rational observables,
canonical identities/state/reason/resolution bytes, save/trace digests and actual
resolution variants. They support the existing bounded claims rather than constituting
new findings. Null mean remains unknown rather than known zero; null choice remains
distinct from Chosen. NoCandidates at65 retains preference. All comparator identities
and sampled equalities/divergences remain present.

The three read-only stored matrix/wrapper checks pass: component256/1248,
native256/3040 and55-producer/58-factory scope. They do not execute new simulations.
The prior90 paragraph and15 finding-field sources retain their exact hashes and
scope. Component same-instant comparisons retain3/8 differences and5/8 equalities;
native receiving contexts59..64 have different addressed RNG times. Refold equality
with complete retained originals is not lifetime compression or Value irreducibility.

Readiness cases2/3 and autonomous part of7 remain stronger unexecuted requirements.
No physical-world feedback, learned category recognition, autonomous goal lifecycle,
Values-to-appraisal, general provenance/correlation or developmental integration is
qualified. This closes the512-run classification omission only; it does not silently
whole-review remaining plan/development metadata or satisfy HQ011 adequacy.

Original source index remainsREV185:10,358 assigned/1,015 unassigned;
131,393 narrative/211,258 backing;1,192 indexed archives. These512 post-cutoff
sources and77,414 strings are separate denominators, not added to the original census.
Seven early runtime source identities,80 exit-inventory identities, one scheduler
identity, formula provenance and the legacy log remain open. Formula/Values delta
joins and independent adequacy remain required before HQ012.

No new runtime/build, model, allocation, law, verdict, corpus promotion or obligation
closure.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:512 post-cutoff Values run files classified as backing.
Start CAMPAIGN3_HISTORY_VALUES_BACKING_CHECKPOINT.md.
77414 exact string occurrences;103766 primitive leaves;78 schemas;three stored checks.
Prior90 paragraphs/15 finding fields unchanged;stronger cases2/3/7 remain OPEN.
No fresh simulation/build;remaining plan/development metadata not silently covered.
SourceREV185 unchanged:10358 assigned/1015 unassigned;131393 narrative/211258 backing;
1192 archives. Post-cutoff backing is a separate denominator.
Seven early runtime hashes plus80 exit-inventory and one scheduler hash OPEN.
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
