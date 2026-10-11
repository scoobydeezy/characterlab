from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev268/check.json');assert c['assignedSources']==11192
cp=P/'CAMPAIGN3_HISTORY_BODY_COMPONENT_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical body component fault controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Nine receipts preserve 65 original narrative occurrences and 306 JSON string leaves.
They record 53 detected mutation occurrences across recall, cue admission, sample
selection, signal grouping, contrastive attribution and retained attribution use.
Repeated successor controls are not new independent phenomena or serious competing laws.

Thirty-seven source bindings match exact current or previously indexed bytes. Six
historical source bindings remain unresolved after checking those two locations;
see campaign3-history-body-component-controls-rev1/unresolved.json. This is not a
global absence claim. Stored detection remains historical testimony, without a
fresh source-exact reproducibility claim. Later qualification does not replace hashes.

The controls preserve absence versus observed zero, opportunity versus timestamp,
signals versus views, strict interval contrast, binding versus actual use and
unavailable assessment versus no consumption. Trusted supplied identities, grouping
and memory adapters do not establish public source authentication or persistence.
The later General Attention qualification supplies its own bounded public evidence.

Source REV268: 11,192 assigned / 181 unassigned; 193,946 narrative / 212,202 backing;
1,316 indexed backing resources. No runtime tests or historical writers were rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY; 108 verdicts; 132 bounded clauses; 55 / 58 wrappers;
corpus0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-body-component-controls-rev1','campaign3-history-source-roles-rev268'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: body component fault-control receipts reconciled.
Start CAMPAIGN3_HISTORY_BODY_COMPONENT_CONTROLS_CHECKPOINT.md.
Nine sources preserve 65 original narrative occurrences and 306 string leaves.
53 stored detected controls; 37 exact bindings; six historical source gaps explicit.
Source REV268: 11192 assigned / 181 unassigned; 193946 narrative / 212202 backing;
1316 backing resources. Component mutation controls are not public qualification.
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
