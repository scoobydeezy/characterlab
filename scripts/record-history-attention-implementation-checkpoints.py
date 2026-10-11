from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev256/check.json');assert c['assignedSources']==11138
cp=P/'CAMPAIGN3_HISTORY_ATTENTION_IMPLEMENTATION_CHECKPOINTS.md';assert not cp.exists()
cp.write_text('''# Historical attention implementation checkpoints — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven sources preserve82 exact original narrative occurrences. The planned18-source
budget counts requested completed selectors, including empty ones; the earlier fixture
executed17. Cue admission itself adds no formation source. Successful acquisition,
surviving memory, observation count and protocol enrollment remain different quantities.

The nine-sweep successor's27-key proof depends on empty tracking and no external keys.
The later ten-sweep inventory uses30; neither graph survival nor retrieval can justify
truncating episodic keys. Local80-invocation/58-output accounting was not the final
whole-model proof. Final GA qualification separately derives92/239/228 and reports
observed21 without substituting that observed maximum for the conservative bound.

The first35 models lacked a matched footprint intervention. Eight successor models
add sparse/dense scenes under four retained laws; peripheral Participants are not
reclassified as Incidental. Exact strength/graph/score differences need not change
winner sets. Likewise UseOnly, SharedProtection and SignificanceFirst have identical
final memory in the retained-credit fixture, so significance priority earns no unique
necessity there. Authored physical correlation does not establish causal efficacy.

The workspace and integrated-producer checkpoints remain internal evidence. Their
1918/252 and1983/257 full-suite receipts predate specified later changes; targeted
receipts cover those increments. The malformed PerceivedSatisfied fixture correction
is retained. Phase reconciliation corrects workspace50 to accepted40 without inventing
new phases; terminal140 cannot emit its own deadline or read provisional sibling writes.
Historical and later cohort schedules retain distinct identities and scope.

Source REV256:11,138 assigned /235 unassigned;192,339 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-attention-implementation-checkpoints-rev1','campaign3-history-source-roles-rev256'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: attention implementation checkpoints reconciled.
Start CAMPAIGN3_HISTORY_ATTENTION_IMPLEMENTATION_CHECKPOINTS.md.
Seven sources;82 original narrative occurrences. Selector/source bounds, staged test
coverage, footprint controls and retained-credit equalities keep their exact scopes.
Source REV256:11138 assigned /235 unassigned;192339 narrative /212202 backing;
1292 backing resources. Values post-cutoff reviews retain separate denominators.
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
