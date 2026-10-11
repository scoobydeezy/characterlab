from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev282/check.json');assert c['assignedSources']==11264
cp=P/'CAMPAIGN3_HISTORY_SUBSTRATE_OBSERVATION_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Substrate and observer control scope — 2026-10-08

**LOCAL DISPOSITION — historical scope reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

The body projection receipt records three existing PRJ tests: captured direct and
nested bindings, derived path/function capture, and exact-domain exclusion. It does
not execute subject-selected body dispatch, permissions, admission or EREG vectors.
The replenishment receipt records six existing ownership/read/patch tests, not
replenishment admission, same-instant composition or EREP public vectors. Each
receipt's 446 preserved fingerprints are consistency checks, not 446 fresh tests.
Their later public embodied qualification is separately scoped and committed.

The observer exploration uses three supplied truth fixtures: completed counts 0/1
produce points, while saturation at 2 yields a lower bound with absent upper bound.
The old fixed-pulse bridge admits only 1 and rejects 0/2. The raw field named
safeSourceReferences still contains the private truth identifier. Its name does not
grant character access; an admitted safe projection remains necessary. Rejection
of requested potential inconsistent with applied zero is invalid-truth exclusion,
not a generated blocked-action witness. Research identifiers remain test controls.
Later cognitive qualification supersedes missing-runtime routing only within its
independently committed public scope.

Three sources preserve 18 original narrative occurrences and all 56 string leaves.
Twelve binding occurrences match exact bytes; one remains unresolved: historical
src/observation/observation.ts hash37542c15dc8f55f9aa2708594cf9107b938dbb9c0e2e3ccc53a0e7a7825d748d.
This search covers current paths and indexed archives, not all history. Stored
observer results remain testimony; no fresh source-exact reproduction is claimed.
The original scripts were read, not rerun. Seven existing sources newly indexed.

Source REV282: 11,264 assigned / 109 unassigned; 194,288 narrative / 212,205 backing;
1,484 backing resources. No model, law, allocation, verdict, corpus or obligation
status changed. Earlier gaps, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY. 108 verdicts; 132 bounded clauses;
55 / 58 wrappers; corpus 0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-substrate-observation-controls-rev1','campaign3-history-source-roles-rev282'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: substrate and observer control scope reconciled.
Start CAMPAIGN3_HISTORY_SUBSTRATE_OBSERVATION_CONTROLS_CHECKPOINT.md.
Nine stored substrate tests/three observer fixtures;12 exact bindings/one source gap.
Private truth references and censored upper bound retained; no public scope inflation.
Source REV282:11264 assigned /109 unassigned;194288 narrative /212205 backing;
1484 backing resources. No historical writer or runtime test rerun.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
