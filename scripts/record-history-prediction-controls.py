from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev228/check.json');assert c['assignedSources']==10937
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Prediction control receipts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Two receipts are reconciled, preserving15 original narrative occurrences and all1220
JSON string leaves, including short rational values and event labels. Ten source
fingerprints bind exactly: nine current files and one recovered historical source.
The memoryExecution.ts bytes match Git commit c825d2679f0f54bb12f96b9edd14411bec1db63b
without newline transformation. Recovery proves exact bytes, not historical time.

Independent Python Fraction arithmetic verifies all four named cases and all1296
length-four combinations from the six-value alphabet. Recurrence equals direct
sum/count and reversal exactly. A separately implemented ties-to-even lattice update
reproduces the historical quantized cases and the first order-dependent witness:
[-1/3,-1/3,0,0] gives exact -1/6, historical forward -83333/500000 and reverse
-166667/1000000. Negative values are algebra controls outside the diagnostic profile.
This is not a new calibration law or evidence of uncertainty/independence.

All16 Boolean control combinations are present once. Their384 recorded event rows
independently reproduce old-memory counts11/12/1 at instants4/5/6. The proposed
application/read delta adds1/2/1, yielding12/14/2 and maximum14 below ceiling100.
These are checked stored schedules and derived prediction counts, not a fresh
execution of either historical runtime. Generic authored-input overload remains
outside this successful-probe bound. Original writer scripts were inspected, not run.

Source REV228: 10,937 assigned /436 unassigned; 189,195 narrative /211,858 backing;
1,220 indexed backing resources. One archive added; no new source gap or runtime/test/
build rerun. No model, law, allocation, verdict, corpus or obligation status change.
Prior gaps, formula provenance, legacy log, post-cutoff joins and independent adequacy
remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-controls-rev1','campaign3-history-source-roles-rev228'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: prediction control receipts reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_CONTROLS_CHECKPOINT.md.
Two sources;15 narrative occurrences;1220 strings;1296 arithmetic/16 schedule checks.
One exact historical source recovered; derived counts are not runtime execution.
Source REV228:10937 assigned /436 unassigned;189195 narrative /211858 backing;
1220 backing resources. Values post-cutoff reviews retain separate denominators.
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
