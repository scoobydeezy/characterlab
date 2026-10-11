from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev279/check.json');assert c['assignedSources']==11257
cp=P/'CAMPAIGN3_HISTORY_CONCERN_FAMILY_COMPARISON_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Concern candidate-family claim correction — 2026-10-08

**LOCAL DISPOSITION — material mathematical wording corrected; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts remain unchanged.

Fresh rational checks verify all30 A/B/C comparison rows and five retrieval-gain
profiles. A reaches the fixture crossover5/3 atq2/3, where canonical tie order
retains x; the first sampled flip is3/4. B reaches only3/2. C with gain3 shares B's
encoding arm but crosses this fixture, retaining4/7 of the peripheral pool at the
first sampled flip versus A's1/4. Gain calibration and curve family remain unearned.

CONCERN_MODULATION_CANDIDATE_C_REV1 architecturalFinding overstates the relationship
by calling A a linear limit of C. The defined family varies retrieval gain only:
E_C(q)=1/(1+q) is unchanged. Atq1, E_C=1/2 for every gain while E_A=0. A therefore
cannot be the limit of the specified family. B is exactly C at gain1; A remains a
distinct retained comparator. A broader interpolating family was not specified or
proved. RO-C3-002 now preserves this correction and its blocked reduction claim.

The A/B finding also calls x unassociated, although its declared pull is1/10.
The demonstrated contrast is weaker association plus greater recency versus stronger
association, not zero association. This wording correction changes no numeric result.

These are finite arithmetic comparisons with fixed q, geometry and hypothetical
retrieval operands, not public same-run source proof or selection of a psychological
law. C6 remains fixture-relative; C's success does not escape the response ceiling.
Later GA evidence supersedes historical blocked routing only within its own scope.

Two sources preserve42 original narrative occurrences and all343 string leaves.
Six binding occurrences/four distinct pairs match exact bytes;no new source gap.
Source REV279:11,257 assigned /116 unassigned;194,225 narrative /212,205 backing;
1,466 backing resources. No historical writers or runtime tests rerun. No model,
law, allocation, verdict, corpus or obligation status changed. Post-cutoff joins,
earlier gaps and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-concern-family-comparison-rev1','campaign3-history-source-roles-rev279'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
o=next(o for o in r['obligations'] if o['id']=='RO-C3-002')
o['established']+=' HQ-011 correction (2026-10-08): all30 A/B/C arithmetic rows and five retrieval-gain profiles reverified exactly. Candidate-C architecturalFinding incorrectly calls A a linear limit of the defined gain-only C family. E_C(1)=1/2 for every gain, whereas E_A(1)=0. B is exactly C at gain1; A remains a distinct comparator, with no broader interpolating family proved. The A/B recent episode has pull1/10, so its description as unassociated is also too strong; results show weaker rather than absent association. Original receipts unchanged.'
o['blocks'].append('Reducing A to a limiting case of the specified gain-only C family on the authority of CONCERN_MODULATION_CANDIDATE_C_REV1')
o['reopenTrigger']+=' A proposed reduction or family-equivalence claim relies on the unproved linear-limit statement.'
o['closureRequirement']+=' Any broader family or limiting-equivalence claim must define its parameters and prove convergence of both encoding and retrieval arms while retaining the original candidates and their discriminating consumers.'
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: concern comparison arithmetic verified;family overstatement corrected.
Start CAMPAIGN3_HISTORY_CONCERN_FAMILY_COMPARISON_CHECKPOINT.md.
30 exact comparison rows/five gain profiles;B=C gain1,A not limit of gain-only C.
42 narrative occurrences/343 strings;six exact bindings;RO002 correction preserved.
Source REV279:11257 assigned /116 unassigned;194225 narrative /212205 backing;
1466 backing resources. No law selected or comparator retired.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN;HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
