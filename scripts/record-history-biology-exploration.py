from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev306/check.json');assert c['assignedSources']==11354
cp=P/'CAMPAIGN3_HISTORY_BIOLOGY_EXPLORATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Biological exploratory cohort lineage — 2026-10-11

**LOCAL DISPOSITION — rejected construction and later corroboration remain distinct.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The three integration explorations contain10/10/11 laws and480/480/528 projected rows.
REV1 combined passive and action changes, masking relief/harm and assigning residual
pleasure to withholding. At24 withdrawal/harm beliefs remain0; at33 control400 still
supports inhibition, so its load was not an inhibition-failure witness. These causal
construction defects do not refute a biological hypothesis or qualify addiction.

REV2 separates elapsed/action physics: harm100 and withdrawal258 at24; control200
with inhibition off at33. Its remaining defects are consequential: sensing included
new same-tick adaptation before the lawful140 boundary, and positive expectation
bypassed cue history. Archived sources and findings retain both failed constructions.

All11 REV3 projected trajectories exactly match the corresponding later main/seed7
results, including NoAppraisalImpulse. All32 domain snapshots likewise match their
later Full results. Sequence, free-drug and loaded-drug counts recalculate exactly.
These are content joins, not additional qualified runs, prospective identity commitments,
or historical timing proof. Domain exploration uses eight main/noLoad seeds plus16
controls; later control probes remain part of the separately frozen52-run matrix.

Four sources contain40,490 string leaves, including short EXPLORATION ONLY labels.
None appeared in the original three-word occurrence extraction; the complete schema
review closes that enumeration blind spot without inventing original occurrence IDs.
Fourteen exact bindings verify archived development bytes and closure membership;
eight existing archives join backing. No original writer, runtime or source changed.

REV306:11,354 assigned /19 unassigned;198,180 narrative /212,699 backing;
2,790 backing resources. Public biology lineage, formal sources, dependent claims,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-biology-exploration-rev1','campaign3-history-source-roles-rev306'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four biological exploratory cohorts reconciled.
Start CAMPAIGN3_HISTORY_BIOLOGY_EXPLORATION_CHECKPOINT.md.
Rejected REV1/2 causal defects preserved;11 REV3 projections/32 domain snapshots match later content.
No extra qualified runs or timing proof.40490 string leaves;14 exact bindings/eight archives.
Source REV306:11354 assigned /19 unassigned;198180 narrative /212699 backing;
2790 backing resources. No runtime replay or original-source change.
Next: public biology lineage, remaining formal sources, dependent claims and final adequacy.
Recheck earlier gaps against expanded backing index; post-cutoff joins remain open.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
