from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev283/check.json');assert c['assignedSources']==11267
cp=P/'CAMPAIGN3_HISTORY_LONGITUDINAL_GOAL_PROGRESS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Longitudinal goal progress evidence — 2026-10-08

**LOCAL DISPOSITION — progress and qualification scopes reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

The first checkpoint captured 20 trajectories and 340 prefix hashes, with zero
restored prefixes. Its session IDs record past execution and are not proof of a
currently live worker. The interim receipt reviewed 72 trajectories. The trajectory
receipt completed all 120 runs under five models but still reported zero of 2,040
required restores. The separately committed later matrix closes that gate with one
immediate successor per restored prefix, not full remaining-tail replay.

This review checked all 120 stored trajectory identities and their 16 rows/17
prefixes against the original plan, and reconstructed the interim and complete
comparison summaries. Fine receiving differs from NoFeedback in 18/24 probability
vectors and 14/24 action sequences. Coarse receiving equals NoFeedback throughout.
Seeds 4/5 cancel standing; four additional action equalities retain differing
probabilities. All 24 KeepAll/expiry comparisons agree for this consumer despite
actual episode loss; this does not establish general dispensability of detail.

All eight maintained/withdrawn and maintained/replaced action contrasts remain.
Native source hashes match across receiver and goal interventions. The negative
GoalEqualsOpportunity control matches withdrawal; it does not justify treating loss
of an opportunity as retirement of an adopted goal. Component goal/receiver ownership
around native acquisition remains distinct from a joined native scheduler.

Three sources preserve four original narrative occurrences and all 811 string
leaves. All 357 binding occurrences / 242 distinct path-hash pairs match exact
bytes. One existing checker newly indexed; no new gap. No historical writer,
stochastic runtime or prefix restoration was rerun in this reconciliation.

Source REV283: 11,267 assigned / 106 unassigned; 194,292 narrative / 212,205 backing;
1,485 backing resources. No model, law, allocation, verdict, corpus or obligation
status changed. Earlier gaps, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY. 108 verdicts; 132 bounded clauses;
55 / 58 wrappers; corpus 0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-009','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-longitudinal-goal-progress-rev1','campaign3-history-source-roles-rev283'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: longitudinal goal progress receipts reconciled.
Start CAMPAIGN3_HISTORY_LONGITUDINAL_GOAL_PROGRESS_CHECKPOINT.md.
120 stored trajectories/24 interim and24 complete comparisons;357 exact bindings.
20/72/120 trajectory progress remains separate from later2040 restored-prefix gate.
Source REV283:11267 assigned /106 unassigned;194292 narrative /212205 backing;
1485 backing resources. Equalities preserved; no new replay or native admission.
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
