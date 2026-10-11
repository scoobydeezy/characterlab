from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev222/check.json');assert c['assignedSources']==10913
cp=P/'CAMPAIGN3_HISTORY_MEMORY_TARGET_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory target and M1/M2 historical reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

The accepted target review and parent memory draft are reconciled, preserving all
90 original narrative occurrences. Their staged decisions link to reviewed component,
packet and runtime evidence plus the separate same-S0 parent intervention.

The target required persistent observation-relative formation and separately usable
later recall. Neither a changed digest nor an archive wrapper substitutes for those
witnesses. Choosing memory did not reject belief psychology or authorize an estimate
of hidden present regulation. That alternative required its own proposition, time,
uncertainty and revision decisions.

M1's proposed new registration grammar was rejected: formal V04 already permitted
RegisteredTransitionProducer resolution through the accepted V07 producer. The old
compiler's limited admitted profile did not establish a missing formal relationship.
Distinct measurement learning evidence preserves actual337 and its allocated output
identity without widening consequence270 or gaining persistent write permission.

M2 accepts only finite required-record descent before ordinary IDN projection, with
admission before extraction. The field-ID path list grants no list/map/reference
traversal, fallback or generic schema search. Observer-copy StrategyB remains a viable
competitor if exact equality is enforced through construction, decode, admission,
completion and restore. Avoiding duplicated bytes alone did not earn StrategyA.

The historical implementation's participant attribution, salience, Need outcomes,
retrieval history and prediction errors were not imported. Precision1 remains
observation metadata rather than confidence, learning weight or surprise. Exact
retention does not qualify general search, accessibility, decay, topK, reinforcement
or consolidation. Those preserved reference obligations are neither rejected nor
waived. The stronger same-S0 parent experiment remains distinct from the initial
memory qualification using different adaptation S0.

Source REV222: 10,913 assigned /460 unassigned; 188,543 narrative /211,856 backing;
1,219 indexed backing resources. No new source gap or archive, runtime/test/build
rerun, model, law, allocation, verdict, corpus or obligation status change.
Prior source gaps, formula provenance, legacy log, post-cutoff joins and independent
adequacy remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-target-rev1','campaign3-history-source-roles-rev222'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: memory target/parent draft reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_TARGET_CHECKPOINT.md.
90 narrative occurrences; M1 reuse/M2 bounds and observer-copy competitor preserved.
Broader reference memory mechanisms remain distinct from bounded exact retention.
Source REV222:10913 assigned /460 unassigned;188543 narrative /211856 backing;
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
