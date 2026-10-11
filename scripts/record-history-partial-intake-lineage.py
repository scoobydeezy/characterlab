from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev284/check.json');assert c['assignedSources']==11274
cp=P/'CAMPAIGN3_HISTORY_PARTIAL_INTAKE_LINEAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Partial coverage intake lineage — 2026-10-08

**LOCAL DISPOSITION — seven historical audit revisions reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

All seven revisions retain the same 20 clause identities, exact requirement text,
prior evidence lists and obligation lists. Their 140 clause occurrences remain
preserved, including duplicate citations, which are not independent corroboration.
Only dispositions and next-step wording change. Audited totals advance through
2, 4, 7, 10, 13, 16 and 20. The last revision ends with five bounded qualifications
and fifteen partial clauses, not a blanket closure or the current campaign status.

The five advances are scoped: tolerance covers the disjunctive branch without
sensitization; substitution supplies multiple actions without general discovery;
controlled episode/category consolidation does not establish general fusion;
repeated prediction discrepancy does not establish a general surprise law; positive
threat with chosen continuation does not establish literal locomotor flight.

The remaining requirements preserve evidence-quality use, importance versus urgency,
vividness, actual affect-to-retrieval consumption, explicit uncertainty and hidden
cause, named scalar-reduction comparisons, cross-context meaning, enacted coercion,
interference learning, and longitudinal routine/goal/habit/loss integration.
Scheduled repetition, instructions, skill practice and episode expiry cannot be
silently substituted for those last four phenomena. Later exact clause evidence is
separately recorded in the exit-audit chain; it does not widen the earlier fixtures.
The final historical adequacy gate remains independent of bounded clause counts.

Seven sources preserve 353 original narrative occurrences and all 2,030 string
leaves. All seven predecessor fingerprints match exact bytes; no new source gap or
outside-census resource. Source REV284: 11,274 assigned / 99 unassigned;
194,645 narrative / 212,205 backing; 1,485 backing resources.
No model, law, allocation, verdict, corpus or obligation status changed.
Earlier gaps, post-cutoff joins and independent adequacy remain open. HQ-012 unstarted;
Campaign3 NOT EXIT-READY. 108 verdicts; 132 bounded clauses; 55 / 58 wrappers;
corpus 0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-partial-intake-lineage-rev1','campaign3-history-source-roles-rev284'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: seven partial-coverage intake revisions reconciled.
Start CAMPAIGN3_HISTORY_PARTIAL_INTAKE_LINEAGE_CHECKPOINT.md.
140 clause occurrences; identities/text/evidence/RO links preserved; seven exact predecessors.
Historical five bounded/fifteen partial checkpoint remains separate from later coverage.
Source REV284:11274 assigned /99 unassigned;194645 narrative /212205 backing;
1485 backing resources. No new qualification or runtime rerun.
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
