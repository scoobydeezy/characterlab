from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev265/check.json');assert c['assignedSources']==11177
cp=P/'CAMPAIGN3_HISTORY_FRONTIER_CHECKPOINTS.md';assert not cp.exists()
cp.write_text('''# Historical frontier and execution checkpoints — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Six sources preserve 86 original narrative occurrences. BODY intake separates an
immutable diagnostic reference from physical dynamics and safe interoception. It
keeps permission, selection, encoding strength and retrieval distinct; heterogeneous
motives can share evidence without automatically becoming redundant. Its generic
CharacterLearningEvidence wording does not rename the accepted outcome-specific carrier.

The Brief frontier is a risk-based research order, not Campaign4 reduction ranking.
All132 clauses and21 corpus members retain their separate denominators. Agency,
coercion, goal/plan distinctions and represented identity remain distinct requirements;
later bounded qualifications supersede the then-next routing only within named scope.

The identity execution checkpoint records all four workers completed84 runs and428
selected native prefixes. Its session numbers are historical, not live jobs. No
exclusive writer was restarted. The old Campaign2 pause was subsequently resumed;
its component math comparisons were not already public runtime or persistence proof.

The inherited crosswalk's51 EVID/REG/ADAPT rows were explicitly unqualified at first
audit. File-existence checks did not pass vectors. The later review preserves the
no-body/public versus generic component split, time-only invalidity, exact key and
parameter ownership, actual source reachability and capability-isolation correction.
Later test counts are separate source cuts, not retroactive proof for earlier bytes.

Source REV265: 11,177 assigned / 196 unassigned; 193,849 narrative / 212,202 backing;
1,293 indexed backing resources. No runtime tests, model, law, allocation, verdict,
corpus or obligation status changed. Source gaps, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY. Counters1519 / 0;
108 verdicts;132 bounded clauses;55 / 58 wrappers;corpus0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-frontier-checkpoints-rev1','campaign3-history-source-roles-rev265'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: frontier and execution checkpoint histories reconciled.
Start CAMPAIGN3_HISTORY_FRONTIER_CHECKPOINTS.md.
Six sources preserve 86 original narrative occurrences. Diagnostic/body distinction,
vector qualification scope and historical terminal workers remain explicit.
Source REV265: 11177 assigned / 196 unassigned; 193849 narrative / 212202 backing;
1293 backing resources. Bounded clause coverage does not discharge whole-corpus gates.
Next: remaining material support, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 / 0;108 verdicts;55 / 58 wrappers;
132 bounded clauses;corpus0.29.0 / 21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
