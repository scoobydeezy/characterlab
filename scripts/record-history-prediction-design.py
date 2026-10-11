from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev227/check.json');assert c['assignedSources']==10935
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_DESIGN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Measurement prediction design history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three draft/symbolic/shape-review documents are reconciled, preserving150 original
narrative occurrences. Their acceptance links explicitly preserve the later0.2
occurrence correction and separate qualification scopes. The old symbolic SHAPE
ACCEPT never made the incorrect275 occurrence reference current authority.

Application has no semantic occurrence. Later readout is conditional on an owned
leaf, while normal absence, read ablation and suppression still reserve one private
ordinal. Private padding is neither an observation nor character knowledge. Suppression
mirrors scheduling without exposing owner or measurement content; checked T+1 overflow
fails the whole instant. M1 generates opportunities independently of successful
formation or application, with durability still dependent on atomic commit.

The delayed cue is authenticated through its exact private association, not immediate
producer274. Its trace carries InputProjection with empty SourceRecordIds, the actual
M1 parent and a distinct state-read dependency. No fake application parent or cue
occurrence is supplied. Retained support identities grant no payload lookup. Exact
source matching precedes projection; necessary IDN reads precede target derivation,
while collisions must precede prior belief reads. Duplicate support precedes limit
failure, and earlier substrate failures retain their owning layers.

Learned zero stays present and a fresh support changes state even if the mean does
not move. Evidence64 is a laboratory domain bound, not a psychological capacity or
forgetting law. Structural range/role/denominator validity cannot authenticate a saved
mean. Complete original-prefix execution and whole-save/private-association equality
supply that separate proof; cognition never uses replay trace as its evidence source.

Exact-mean algebra and historical quantized estimation remain distinct. Four named
and1296 algebra cases plus the328-reference-test baseline do not pass runtime vectors.
Generic multi-owner/multi-target positive obligations remain where the first public
profile excludes them. Exclusion is not a positive witness, and an own-key comparison
cannot be reported as a discriminating independent-target freeze test. Broader source
quality, uncertainty, action conditioning and current-lane requirements are preserved.

Source REV227: 10,935 assigned /438 unassigned; 189,180 narrative /211,858 backing;
1,219 indexed backing resources. No new source gap/archive, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-design-rev1','campaign3-history-source-roles-rev227'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: prediction design history reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_DESIGN_CHECKPOINT.md.
Three sources;150 narrative occurrences; delayed cue and history proof distinct.
Generic positive obligations and occurrence correction preserved; no runtime rerun.
Source REV227:10935 assigned /438 unassigned;189180 narrative /211858 backing;
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
